import pytest 
from app.models.llm.factory import LLMFactory
from app.models.llm.types import ProviderType

@pytest.mark.asyncio
async def test_llm():
    llm = LLMFactory.create_provider(provider=ProviderType.OPENROUTER)

    print("Valid:", llm.validate())

    res = await llm.generate(
        prompt="Explain AI in 1 sentence"
    )

    print("LLM OUTPUT: ", res)

    assert res is not None 