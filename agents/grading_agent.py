from llm.provider import LLMProvider 
from utils.helpers import extract_mistakes, extract_score
from memory.long_term import save_mistake, save_score

llm = LLMProvider()

def grading_agent(user_id, answer):
    with open("prompts/grading_prompt.txt") as f:
        template = f.read()
    
    prompt = template.format(answer=answer)
    response = llm.generate(prompt)

    mistakes = extract_mistakes(response)
    if mistakes:
        for m in mistakes:
            save_mistake(user_id, m[0], m[1])

    score = extract_score(response)
    if score is not None: 
        save_score(user_id, score)
        
    return response 