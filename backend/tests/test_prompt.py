import pytest 
from app.models.llm.factory import LLMFactory
from app.models.llm.types import ProviderType
from app.prompts.research import RESEARCH_KEYWORD_PROMPT

@pytest.mark.asyncio
async def test_prompt():
    llm = LLMFactory.create_provider(provider=ProviderType.OPENROUTER)

    print("Valid:", llm.validate())

    prompt = RESEARCH_KEYWORD_PROMPT.format(
        query="Multi-Agent Systems in Healthcare"
    )

    response = await llm.generate(prompt)

    print(response)