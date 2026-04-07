from llm.provider import LLMProvider

llm = LLMProvider()

def qa_agent(question):
    with open("prompts/qa_prompt.txt") as f:
        template = f.read()
    
    prompt = template.format(question=question)
    return llm.generate(prompt)