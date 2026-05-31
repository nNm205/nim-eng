import asyncio
from sentence_transformers import SentenceTransformer
from app.tools.document.embeddings.base import BaseEmbeddingGenerator
from app.tools.document.schemas.chunk import DocumentChunk
from app.tools.document.schemas.embedded_chunk import EmbeddedChunk

BGE_MODEL_NAME = "BAAI/bge-small-en-v1.5"


class BGEEmbeddingGenerator(BaseEmbeddingGenerator):
    def __init__(self, model_name: str = BGE_MODEL_NAME):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)

    async def embed_chunks(
        self,
        chunks: list[DocumentChunk]
    ) -> list[EmbeddedChunk]:
        texts = [chunk.text for chunk in chunks]

        # SentenceTransformer.encode() là blocking — chạy trong thread pool
        # để không block event loop
        vectors = await asyncio.to_thread(
            self.model.encode,
            texts,
            normalize_embeddings=True,
        )

        return [
            EmbeddedChunk(chunk=chunk, embedding=vector.tolist())
            for chunk, vector in zip(chunks, vectors)
        ]
