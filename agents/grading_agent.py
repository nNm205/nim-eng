from llm.provider import LLMProvider 
from utils.helpers import extract_mistakes
from memory.long_term import save_mistake

llm = LLMProvider()

def grading_agent(user_id, answer):
    with open("prompts/grading_prompt.txt") as f:
        template = f.read()
    
    prompt = template.format(answer=answer)
    response = llm.generate(prompt)

    mistakes = extract_mistakes(response)
    print("Extracted mistakes:", mistakes)
    
    if mistakes:
        for m in mistakes:
            save_mistake(user_id, m[0], m[1])

    return response

print(grading_agent(user_id=1, answer="She was going to school now"))