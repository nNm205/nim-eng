from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.embedding_providers.factory import EmbeddingFactory
from app.models.embedding_providers.types import EmbeddingProviderType
from app.tools.document.fetchers.pdf_fetcher import PDFFetcher
from app.tools.document.parsers.pdf_parser import PDFParser
from app.tools.document.chunkers.recursive_chunker import RecursiveChunker
from app.tools.document.embeddings.provider_embedding import ProviderEmbeddingGenerator
from app.tools.document.vectorstores.factory import VectorStoreFactory

def _build_embedder() -> ProviderEmbeddingGenerator:
    provider_type = EmbeddingProviderType(settings.EMBEDDING_PROVIDER)
    model = settings.EMBEDDING_MODEL or None  
    provider = EmbeddingFactory.create_provider(provider_type, model=model)
    return ProviderEmbeddingGenerator(provider)

class DocumentIngestionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.fetcher = PDFFetcher()
        self.parser = PDFParser()
        self.chunker = RecursiveChunker()
        self.embedder = _build_embedder()
        self.vector_store = VectorStoreFactory.create(db)

    async def ingest_pdf(
        self,
        project_id: UUID,
        pdf_url: str,
    ) -> Document:
        fetched_doc = None
        try:
            # 1. Fetch PDF về local (tạm thời để parse)
            fetched_doc = await self.fetcher.fetch(pdf_url)

            # 2. Parse text từ PDF
            parsed_doc = await self.parser.parse(fetched_doc.local_path)

            # 3. Xóa file local ngay sau khi parse xong — không cần giữ lại
            #    vì toàn bộ nội dung đã được extract vào parsed_doc.text
            try:
                fetched_doc.local_path.unlink(missing_ok=True)
            except Exception:
                pass  # không để lỗi xóa file làm hỏng ingestion

            # 4. Tạo Document record — file_path=None vì không lưu local
            document = Document(
                project_id=project_id,
                title=parsed_doc.title or pdf_url.split("/")[-1],
                source_url=pdf_url,
                content=parsed_doc.text,
                file_path=None,
                processed=False,
            )

            self.db.add(document)
            await self.db.flush()  # lấy document.id trước khi tạo chunks

            # 5. Chunk text
            tool_chunks = await self.chunker.chunk(parsed_doc.text)

            # 6. Tạo DocumentChunk ORM models
            chunk_models = []
            for tool_chunk in tool_chunks:
                chunk = DocumentChunk(
                    document_id=document.id,
                    chunk_index=tool_chunk.chunk_id,
                    content=tool_chunk.text,
                )
                chunk_models.append(chunk)

            self.db.add_all(chunk_models)
            await self.db.flush()  # lấy chunk.id trước khi embed

            # 7. Embed via configured provider
            embedded_chunks = await self.embedder.embed_chunks(tool_chunks)

            # 8. Upsert vectors vào pgvector
            chunk_ids = [chunk.id for chunk in chunk_models]
            vectors = [ec.embedding for ec in embedded_chunks]

            await self.vector_store.upsert_many(
                chunk_ids=chunk_ids,
                vectors=vectors,
                model_name=self.embedder._provider.get_model_name(),
            )

            # 9. Đánh dấu đã xử lý xong
            document.processed = True

            await self.db.commit()
            await self.db.refresh(document)

            return document

        except Exception as e:
            # Dọn file local nếu có lỗi xảy ra sau khi fetch
            if fetched_doc is not None:
                try:
                    fetched_doc.local_path.unlink(missing_ok=True)
                except Exception:
                    pass
            await self.db.rollback()
            raise e
