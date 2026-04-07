import streamlit as st 
from core.orchestrator import orchestrator

st.title("AI English Tutor")

mode = st.selectbox(
    "Choose mode:", ["Ask (Grammar/Vocav)", "Practice Exercise", "Check Writing"]
)

user_input = st.text_area("Your input:")

if st.button("Submit"):
    if mode == "Check Writing":
        user_input = "grading: " + user_input
    elif mode == "Practice Exercises":
        user_input = "exericse: " + user_input 
    
    response = orchestrator(user_input)
    st.write(response)