from app.tools.document.embeddings.base import BaseEmbeddingGenerator
from app.tools.document.schemas.chunk import DocumentChunk
from app.tools.document.schemas.embedded_chunk import EmbeddedChunk
from app.models.embedding_providers.base import EmbeddingProvider


class ProviderEmbeddingGenerator(BaseEmbeddingGenerator):
    """
    Adapter that bridges BaseEmbeddingGenerator (document pipeline)
    with EmbeddingProvider (HuggingFace / Jina / GoogleAI).

    Usage:
        provider = EmbeddingFactory.create_provider(EmbeddingProviderType.JINA)
        embedder = ProviderEmbeddingGenerator(provider)
    """

    def __init__(self, provider: EmbeddingProvider):
        self._provider = provider

    async def embed_chunks(
        self,
        chunks: list[DocumentChunk],
    ) -> list[EmbeddedChunk]:
        texts = [chunk.text for chunk in chunks]
        vectors = await self._provider.embed_batch(texts)

        return [
            EmbeddedChunk(chunk=chunk, embedding=vector)
            for chunk, vector in zip(chunks, vectors)
        ]
