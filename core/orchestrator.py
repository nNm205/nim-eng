from core.router import detect_intent
from agents.qa_agent import qa_agent
from agents.exercise_agent import exercise_agent
from agents.grading_agent import grading_agent 

def orchestrator(user_input):
    intent = detect_intent(user_input)

    if "exercise" in intent: 
        return exercise_agent(user_input)
    elif "grading" in intent: 
        return grading_agent(user_input)
    else:
        return qa_agent(user_input) 