from llm.provider import LLMProvider

llm = LLMProvider()

def exercise_agent(topic, level='easy'):
    with open("prompts/exercise_prompt.txt") as f:
        template = f.read()

    prompt = template.format(topic=topic, level=level)
    return llm.generate(prompt)