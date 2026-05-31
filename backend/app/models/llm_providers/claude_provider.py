import requests 
from typing import Optional, List, Dict
from anthropic import AsyncAnthropic
from app.models.llm_providers.base import LLMProvider
from app.config import settings

class ClaudeProvider(LLMProvider):
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = None 
    ):
        self.api_key = api_key
        self.base_url = settings.CLAUDE_BASE_URL 
        self.model = model
        self.client = AsyncAnthropic(api_key=self.api_key)
        self.headers = {
            "x-api-key": self.api_key,
            "content-type": "application/json"
        }

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        **kwargs
    ) -> str:
        res = await self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt or "",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return res.content[0].text

    async def chat(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> str:

        system = None
        if messages and messages[0]["role"] == "system":
            system = messages[0]["content"]
            messages = messages[1:]

        res = await self.client.messages.create(
            model=self.model,
            max_tokens=kwargs.get("max_tokens", 1024),
            temperature=kwargs.get("temperature", 0.7),
            system=system or "",
            messages=messages
        )

        return res.content[0].text

    def validate(self) -> bool:
        try:
            r = requests.post(
                f"{self.base_url}/messages",
                headers=self.headers,
                json={
                    "model": self.model,
                    "max_tokens": 5,
                    "messages": [{"role": "user", "content": "hi"}]
                },
                timeout=10
            )

            return r.status_code == 200

        except Exception as e:
            print("Claude validate error:", e)
            return False

    def get_model_name(self) -> str:
        return self.model