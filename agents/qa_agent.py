from llm.provider import LLMProvider
from memory.long_term import get_recent_history

llm = LLMProvider()

def qa_agent(user_id, question):
    history = get_recent_history(user_id)

    history_text = "\n".join([f"Q: {h[0]} A: {h[1]}" for h in history])

    with open("prompts/qa_prompt.txt") as f:
        template = f.read()
    
    prompt = f"""
    Conversation history: 
    {history_text}

    {template.format(question=question)}
    """
    
    return llm.generate(prompt)