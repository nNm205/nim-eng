from enum import Enum

class EmbeddingProviderType(str, Enum):
    HUGGINGFACE = "huggingface"
    JINA = "jina"
    GOOGLEAI = "googleai"
