import streamlit as st 
from core.orchestrator import orchestrator

st.title("AI English Tutor")

mode = st.selectbox(
    "Choose mode:", 
    ["Ask", 
     "Exercise", 
     "Check Writing",
     "Learning Path"]
)

user_input = st.text_area("Your input:")

if st.button("Submit"):
    if mode == "Check Writing":
        user_input = "grading: " + user_input
    elif mode == "Exercise":
        user_input = "exericse: " + user_input 
    elif mode == "Learning Path":
        user_input = "curriculum"
    
    response = orchestrator(user_input, user_id=1)
    st.write(response)