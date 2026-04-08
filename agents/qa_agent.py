from llm.provider import LLMProvider
from memory.long_term import get_recent_history, get_weakness

llm = LLMProvider()

def qa_agent(user_id, question):
    history = get_recent_history(user_id, limit=5)

    history_text = "\n".join(
        [f"User: {h[0]}\nTutor: {h[1]}" for h in history]
    )

    weakness = get_weakness(user_id)
    extra = ""
    if weakness: 
        extra = f"""
        IMPORTANT: 
        The student is weak in {weakness}. 
        You must focus your explanation on helping them improve this skill.
        """

    with open("prompts/qa_prompt.txt") as f:
        template = f.read()
    
    prompt = f"""
    Conversation history: 
    {history_text}

    {extra}

    {template.format(question=question)}
    """
    
    return llm.generate(prompt)