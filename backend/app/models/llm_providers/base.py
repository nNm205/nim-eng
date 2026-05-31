from abc import ABC, abstractmethod 
from typing import Optional, List, Dict, Any 

class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs 
    ) -> str:
        pass
    
    @abstractmethod
    async def chat(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> str: 
        pass 

    @abstractmethod
    def validate(self) -> bool:
        pass 

    @abstractmethod
    def get_model_name(self) -> str:
        pass 