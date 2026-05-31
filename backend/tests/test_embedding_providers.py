"""
Integration tests for embedding providers (HuggingFace, Jina, GoogleAI).
These tests make real API calls — ensure the keys in .env are valid before running.

Run all:
    pytest tests/embedding/ -v -s

Run a single provider:
    pytest tests/embedding/ -v -s -k "huggingface"
    pytest tests/embedding/ -v -s -k "jina"
    pytest tests/embedding/ -v -s -k "googleai"
"""

import pytest
from app.models.embedding_providers.factory import EmbeddingFactory
from app.models.embedding_providers.types import EmbeddingProviderType


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _assert_vector(vector, expected_dim: int | None = None):
    """Common assertions for a single embedding vector."""
    assert isinstance(vector, list), "Embedding must be a list"
    assert len(vector) > 0, "Embedding must not be empty"
    assert all(isinstance(v, float) for v in vector), "All values must be float"
    if expected_dim:
        assert len(vector) == expected_dim, (
            f"Expected {expected_dim} dims, got {len(vector)}"
        )


# ---------------------------------------------------------------------------
# HuggingFace
# ---------------------------------------------------------------------------

class TestHuggingFaceProvider:
    def setup_method(self):
        self.provider = EmbeddingFactory.create_provider(
            EmbeddingProviderType.HUGGINGFACE
        )

    def test_validate(self):
        result = self.provider.validate()
        print(f"\n[HuggingFace] validate: {result}")
        assert result is True

    def test_get_model_name(self):
        name = self.provider.get_model_name()
        print(f"[HuggingFace] model: {name}")
        assert isinstance(name, str) and len(name) > 0

    def test_get_dimensions(self):
        dims = self.provider.get_dimensions()
        print(f"[HuggingFace] dimensions: {dims}")
        assert isinstance(dims, int) and dims > 0

    @pytest.mark.asyncio
    async def test_embed_single(self):
        text = "Artificial intelligence is transforming the world."
        vector = await self.provider.embed(text)
        print(f"[HuggingFace] embed() → {len(vector)} dims, first 5: {vector[:5]}")
        _assert_vector(vector, expected_dim=self.provider.get_dimensions())

    @pytest.mark.asyncio
    async def test_embed_batch(self):
        texts = [
            "Machine learning is a subset of AI.",
            "Deep learning uses neural networks.",
            "Natural language processing handles text.",
        ]
        vectors = await self.provider.embed_batch(texts)
        print(f"[HuggingFace] embed_batch() → {len(vectors)} vectors")
        assert len(vectors) == len(texts), "Must return one vector per input"
        for v in vectors:
            _assert_vector(v, expected_dim=self.provider.get_dimensions())

    @pytest.mark.asyncio
    async def test_embed_consistency(self):
        """Same text should produce the same vector on repeated calls."""
        text = "Consistency check."
        v1 = await self.provider.embed(text)
        v2 = await self.provider.embed(text)
        assert v1 == v2, "Same input must produce identical vectors"


# ---------------------------------------------------------------------------
# Jina
# ---------------------------------------------------------------------------

class TestJinaProvider:
    def setup_method(self):
        self.provider = EmbeddingFactory.create_provider(
            EmbeddingProviderType.JINA
        )

    def test_validate(self):
        result = self.provider.validate()
        print(f"\n[Jina] validate: {result}")
        assert result is True

    def test_get_model_name(self):
        name = self.provider.get_model_name()
        print(f"[Jina] model: {name}")
        assert isinstance(name, str) and len(name) > 0

    def test_get_dimensions(self):
        dims = self.provider.get_dimensions()
        print(f"[Jina] dimensions: {dims}")
        assert isinstance(dims, int) and dims > 0

    @pytest.mark.asyncio
    async def test_embed_single(self):
        text = "Artificial intelligence is transforming the world."
        vector = await self.provider.embed(text)
        print(f"[Jina] embed() → {len(vector)} dims, first 5: {vector[:5]}")
        _assert_vector(vector, expected_dim=self.provider.get_dimensions())

    @pytest.mark.asyncio
    async def test_embed_batch(self):
        texts = [
            "Machine learning is a subset of AI.",
            "Deep learning uses neural networks.",
            "Natural language processing handles text.",
        ]
        vectors = await self.provider.embed_batch(texts)
        print(f"[Jina] embed_batch() → {len(vectors)} vectors")
        assert len(vectors) == len(texts)
        for v in vectors:
            _assert_vector(v, expected_dim=self.provider.get_dimensions())

    @pytest.mark.asyncio
    async def test_embed_with_task_type(self):
        """Jina supports task hints for retrieval — verify it still returns valid vectors."""
        from app.models.embedding_providers.jina_provider import JinaProvider
        from app.config import settings

        provider = JinaProvider(
            api_key=settings.JINA_API_KEY,
            task="retrieval.query",
        )
        vector = await provider.embed("What is machine learning?")
        print(f"[Jina] embed(task=retrieval.query) → {len(vector)} dims")
        _assert_vector(vector)

    @pytest.mark.asyncio
    async def test_embed_consistency(self):
        text = "Consistency check."
        v1 = await self.provider.embed(text)
        v2 = await self.provider.embed(text)
        assert v1 == v2, "Same input must produce identical vectors"


# ---------------------------------------------------------------------------
# Google AI
# ---------------------------------------------------------------------------

class TestGoogleAIProvider:
    def setup_method(self):
        self.provider = EmbeddingFactory.create_provider(
            EmbeddingProviderType.GOOGLEAI
        )

    def test_validate(self):
        result = self.provider.validate()
        print(f"\n[GoogleAI] validate: {result}")
        assert result is True

    def test_get_model_name(self):
        name = self.provider.get_model_name()
        print(f"[GoogleAI] model: {name}")
        assert isinstance(name, str) and len(name) > 0

    def test_get_dimensions(self):
        dims = self.provider.get_dimensions()
        print(f"[GoogleAI] dimensions: {dims}")
        assert isinstance(dims, int) and dims > 0

    @pytest.mark.asyncio
    async def test_embed_single(self):
        text = "Artificial intelligence is transforming the world."
        vector = await self.provider.embed(text)
        print(f"[GoogleAI] embed() → {len(vector)} dims, first 5: {vector[:5]}")
        _assert_vector(vector, expected_dim=self.provider.get_dimensions())

    @pytest.mark.asyncio
    async def test_embed_batch(self):
        texts = [
            "Machine learning is a subset of AI.",
            "Deep learning uses neural networks.",
            "Natural language processing handles text.",
        ]
        vectors = await self.provider.embed_batch(texts)
        print(f"[GoogleAI] embed_batch() → {len(vectors)} vectors")
        assert len(vectors) == len(texts)
        for v in vectors:
            _assert_vector(v, expected_dim=self.provider.get_dimensions())

    @pytest.mark.asyncio
    async def test_embed_with_task_type(self):
        """Google AI supports task_type for retrieval — verify it still returns valid vectors."""
        from app.models.embedding_providers.googleai_provider import GoogleAIProvider
        from app.config import settings

        provider = GoogleAIProvider(
            api_key=settings.GOOGLEAI_API_KEY,
            model="gemini-embedding-001",
            task_type="RETRIEVAL_QUERY",
        )
        vector = await provider.embed("What is machine learning?")
        print(f"[GoogleAI] embed(task_type=RETRIEVAL_QUERY) → {len(vector)} dims")
        _assert_vector(vector)

    @pytest.mark.asyncio
    async def test_embed_consistency(self):
        text = "Consistency check."
        v1 = await self.provider.embed(text)
        v2 = await self.provider.embed(text)
        assert v1 == v2, "Same input must produce identical vectors"


# ---------------------------------------------------------------------------
# Cross-provider sanity check
# ---------------------------------------------------------------------------

class TestCrossProvider:
    @pytest.mark.asyncio
    async def test_all_providers_return_vectors_for_same_text(self):
        """
        All providers should return non-empty float vectors for the same input.
        Dimensions will differ across providers — that's expected.
        """
        text = "The quick brown fox jumps over the lazy dog."

        results = {}
        for provider_type in EmbeddingProviderType:
            provider = EmbeddingFactory.create_provider(provider_type)
            vector = await provider.embed(text)
            results[provider_type.value] = len(vector)
            _assert_vector(vector)

        print("\n[Cross-provider] vector dimensions:")
        for name, dim in results.items():
            print(f"  {name}: {dim} dims")
