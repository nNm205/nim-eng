from llm.provider import LLMProvider

llm = LLMProvider() 

def detect_intent(user_input):
    with open("prompts/router_prompt.txt") as f:
        template = f.read() 

    prompt = template + f"\nInput: {user_input}"

    return llm.generate(prompt).strip() 