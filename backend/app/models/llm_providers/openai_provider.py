import requests
from typing import Optional, List, Dict 
from openai import AsyncOpenAI 
from app.models.llm_providers.base import LLMProvider
from app.config import settings

class OpenAIProvider(LLMProvider):
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = None 
    ):
        self.api_key = api_key
        self.model = model 
        self.base_url = settings.OPENAI_BASE_URL 
        self.client = AsyncOpenAI(api_key=self.api_key)
        self.headers={
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        **kwargs
    ) -> str: 
        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        messages.append({"role": "user", "content": prompt})

        res = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        ) 

        return res.choices[0].message.content 

    async def chat(
        self,
        messages: List[Dict[str, str]],
        **kwargs 
    ) -> str:
        res = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 1024)
        ) 

        return res.choices[0].message.content 
    
    def validate(self) -> bool:
        try:
            r = requests.post(
                f"{self.base_url}/chat/completions", 
                headers=self.headers,
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "user", "content": "hi"}
                    ],
                    "max_tokens": 5
                },
                timeout=10  
            )

            return r.status_code == 200 
             
        except Exception as e:
            print("OpenAI validate error:", e)
            return False  

    def get_model_name(self) -> str:
        return self.model 