from core.router import detect_intent
from agents.qa_agent import qa_agent
from agents.exercise_agent import exercise_agent
from agents.grading_agent import grading_agent 
from memory.long_term import save_interaction

def orchestrator(user_input, user_id=1):
    intent = detect_intent(user_input)

    if "exercise" in intent: 
        response = exercise_agent(user_input)
    elif "grading" in intent: 
        response = grading_agent(user_id, user_input)
    else:
        response = qa_agent(user_id, user_input) 

    save_interaction(user_id, user_input, response)

    return response 