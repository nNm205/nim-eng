from typing import Optional

from app.models.embedding_providers.base import EmbeddingProvider
from app.models.embedding_providers.huggingface_provider import HuggingFaceProvider
from app.models.embedding_providers.jina_provider import JinaProvider
from app.models.embedding_providers.googleai_provider import GoogleAIProvider
from app.models.embedding_providers.types import EmbeddingProviderType
from app.config import settings


_DEFAULT_API_KEYS = {
    EmbeddingProviderType.HUGGINGFACE: settings.HUGGINGFACE_API_KEY,
    EmbeddingProviderType.JINA: settings.JINA_API_KEY,
    EmbeddingProviderType.GOOGLEAI: settings.GOOGLEAI_API_KEY,
}

_DEFAULT_MODELS = {
    EmbeddingProviderType.HUGGINGFACE: "ibm-granite/granite-embedding-97m-multilingual-r2",
    EmbeddingProviderType.JINA: "jina-embeddings-v3",
    EmbeddingProviderType.GOOGLEAI: "gemini-embedding-001",
}


class EmbeddingFactory:
    @staticmethod
    def create_provider(
        provider: EmbeddingProviderType,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        **kwargs,
    ) -> EmbeddingProvider:
        api_key = api_key or _DEFAULT_API_KEYS.get(provider)
        if not api_key:
            raise ValueError(f"Missing API key for embedding provider: {provider}")

        model = model or _DEFAULT_MODELS[provider]

        if provider == EmbeddingProviderType.HUGGINGFACE:
            return HuggingFaceProvider(api_key=api_key, model=model, **kwargs)

        if provider == EmbeddingProviderType.JINA:
            return JinaProvider(api_key=api_key, model=model, **kwargs)

        if provider == EmbeddingProviderType.GOOGLEAI:
            return GoogleAIProvider(api_key=api_key, model=model, **kwargs)

        raise ValueError(f"Unsupported embedding provider: {provider}")
