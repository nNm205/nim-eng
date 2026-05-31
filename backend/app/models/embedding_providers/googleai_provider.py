from typing import List, Optional
from google import genai
from google.genai import types
from app.models.embedding_providers.base import EmbeddingProvider


_GOOGLEAI_MODEL_DIMENSIONS: dict[str, int] = {
    "gemini-embedding-001": 3072,
    "text-embedding-004": 768,
    "embedding-001": 768,
}

class GoogleAIProvider(EmbeddingProvider):
    def __init__(
        self,
        api_key: str,
        model: str = "gemini-embedding-001",
        dimensions: Optional[int] = None,
        task_type: Optional[str] = None,
    ):
        self.api_key = api_key
        self.model = model
        self._dimensions = dimensions or _GOOGLEAI_MODEL_DIMENSIONS.get(model, 3072)
        self.task_type = task_type
        self._client = genai.Client(api_key=api_key)

    def _embed_config(self) -> types.EmbedContentConfig | None:
        if self.task_type:
            return types.EmbedContentConfig(task_type=self.task_type)
        return None

    async def embed(self, text: str) -> List[float]:
        vectors = await self.embed_batch([text])
        return vectors[0]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        import asyncio

        config = self._embed_config()
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: self._client.models.embed_content(
                model=self.model,
                contents=texts,
                config=config,
            ),
        )

        return [e.values for e in result.embeddings]

    def validate(self) -> bool:
        try:
            config = self._embed_config()
            result = self._client.models.embed_content(
                model=self.model,
                contents=["test"],
                config=config,
            )
            return len(result.embeddings) > 0 and len(result.embeddings[0].values) > 0
        except Exception as e:
            print("Google AI validate error:", e)
            return False

    def get_model_name(self) -> str:
        return self.model

    def get_dimensions(self) -> int:
        return self._dimensions
