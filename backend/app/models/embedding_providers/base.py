from abc import ABC, abstractmethod
from typing import List

class EmbeddingProvider(ABC):
    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """Embed a single text string, return vector."""
        pass

    @abstractmethod
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of texts, return list of vectors."""
        pass

    @abstractmethod
    def validate(self) -> bool:
        """Check that the provider is reachable and the API key is valid."""
        pass

    @abstractmethod
    def get_model_name(self) -> str:
        pass

    @abstractmethod
    def get_dimensions(self) -> int:
        """Return the output vector dimension for the current model."""
        pass
