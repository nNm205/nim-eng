from memory.long_term import get_weakness
from llm.provider import LLMProvider

llm = LLMProvider()

def curriculum_agent(user_id):
    weakness = get_weakness(user_id)

    if not weakness:
        return "You can continue learning general English topics."

    prompt = f"""
    You are an English teacher.

    The student is weak in: {weakness}
    
    Suggest the next lesson topic for the student. 

    Keep it short and specific. 
    """

    return llm.generate(prompt)