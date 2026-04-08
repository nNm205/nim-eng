from memory.long_term import get_weakness
from llm.provider import LLMProvider

llm = LLMProvider()

def curriculum_agent(user_id):
    weakness = get_weakness(user_id)

    if not weakness:
        weakness = "general English"

    with open("prompts/curriculum_prompt.txt") as f:
        template = f.read()

    prompt = template.format(weakness=weakness)
    return llm.generate(prompt)