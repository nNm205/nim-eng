from llm.provider import LLMProvider 

llm = LLMProvider()

def grading_agent(answer):
    with open("prompts/grading_prompt.txt") as f:
        template = f.read()
    
    prompt = template.format(answer=answer)
    return llm.generate(prompt)