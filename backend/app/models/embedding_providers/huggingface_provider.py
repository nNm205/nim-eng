import asyncio
from typing import List, Optional
import numpy as np
from huggingface_hub import InferenceClient
from app.models.embedding_providers.base import EmbeddingProvider

_HF_MODEL_DIMENSIONS: dict[str, int] = {
    "sentence-transformers/all-MiniLM-L6-v2": 384,
    "sentence-transformers/all-mpnet-base-v2": 768,
    "BAAI/bge-small-en-v1.5": 384,
    "BAAI/bge-base-en-v1.5": 768,
    "BAAI/bge-large-en-v1.5": 1024,
    "ibm-granite/granite-embedding-97m-multilingual-r2": 384,
}

class HuggingFaceProvider(EmbeddingProvider):
    def __init__(
        self,
        api_key: str,
        model: str = "ibm-granite/granite-embedding-97m-multilingual-r2",
        dimensions: Optional[int] = None,
    ):
        self.api_key = api_key
        self.model = model
        self._dimensions = dimensions or _HF_MODEL_DIMENSIONS.get(model, 768)
        self._client = InferenceClient(
            provider="hf-inference",
            api_key=api_key,
        )

    def _to_vector(self, raw) -> List[float]:
        arr = np.array(raw)
        if arr.ndim == 1:
            return arr.tolist()
        if arr.ndim == 2:
            return arr.mean(axis=0).tolist()

        return arr.squeeze(0).mean(axis=0).tolist()

    async def embed(self, text: str) -> List[float]:
        loop = asyncio.get_event_loop()
        raw = await loop.run_in_executor(
            None,
            lambda: self._client.feature_extraction(text, model=self.model),
        )
        return self._to_vector(raw)

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        loop = asyncio.get_event_loop()

        async def _embed_one(text: str) -> List[float]:
            raw = await loop.run_in_executor(
                None,
                lambda t=text: self._client.feature_extraction(t, model=self.model),
            )
            return self._to_vector(raw)

        return list(await asyncio.gather(*[_embed_one(t) for t in texts]))

    def validate(self) -> bool:
        try:
            raw = self._client.feature_extraction("test", model=self.model)
            vec = self._to_vector(raw)
            return len(vec) > 0
        except Exception as e:
            print("HuggingFace validate error:", e)
            return False

    def get_model_name(self) -> str:
        return self.model

    def get_dimensions(self) -> int:
        return self._dimensions
