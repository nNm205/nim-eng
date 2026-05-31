import requests
from typing import List, Optional
from app.models.embedding_providers.base import EmbeddingProvider

_JINA_EMBED_URL = "https://api.jina.ai/v1/embeddings"

_JINA_MODEL_DIMENSIONS: dict[str, int] = {
    "jina-embeddings-v3": 1024,
    "jina-embeddings-v2-base-en": 768,
    "jina-embeddings-v2-small-en": 512,
    "jina-clip-v2": 1024,
}

class JinaProvider(EmbeddingProvider):
    def __init__(
        self,
        api_key: str,
        model: str = "jina-embeddings-v3",
        dimensions: Optional[int] = None,
        task: Optional[str] = None,
    ):
        self.api_key = api_key
        self.model = model
        self._dimensions = dimensions or _JINA_MODEL_DIMENSIONS.get(model, 1024)
        self.task = task
        self._headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _build_payload(self, texts: List[str]) -> dict:
        payload: dict = {"model": self.model, "input": texts}
        if self.task:
            payload["task"] = self.task
        if self._dimensions:
            payload["dimensions"] = self._dimensions
        return payload

    async def embed(self, text: str) -> List[float]:
        vectors = await self.embed_batch([text])
        return vectors[0]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        import httpx

        payload = self._build_payload(texts)

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                _JINA_EMBED_URL, headers=self._headers, json=payload
            )

        if response.status_code != 200:
            raise RuntimeError(
                f"Jina API error {response.status_code}: {response.text}"
            )

        data = response.json()
        embeddings = sorted(data["data"], key=lambda x: x["index"])
        return [item["embedding"] for item in embeddings]

    def validate(self) -> bool:
        try:
            payload = self._build_payload(["test"])
            r = requests.post(
                _JINA_EMBED_URL, headers=self._headers, json=payload, timeout=15
            )
            return r.status_code == 200
        except Exception as e:
            print("Jina validate error:", e)
            return False

    def get_model_name(self) -> str:
        return self.model

    def get_dimensions(self) -> int:
        return self._dimensions
