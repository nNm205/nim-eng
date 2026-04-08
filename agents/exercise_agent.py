from llm.provider import LLMProvider
from memory.long_term import get_weakness

llm = LLMProvider()

def exercise_agent(user_id, topic=None, level='easy'):
    weakness = get_weakness(user_id)

    if not topic and weakness: 
        topic = weakness

    if not topic: 
        topic = "basic English"

    with open("prompts/exercise_prompt.txt") as f:
        template = f.read()

    prompt = template.format(topic=topic, level=level)
    return llm.generate(prompt)