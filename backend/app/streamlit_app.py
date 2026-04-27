import streamlit as st 
from core.orchestrator import orchestrator
import pandas as pd 
import json 

st.title("AI English Tutor")

mode = st.selectbox(
    "Choose mode:", 
    ["Ask", 
     "Practice", 
     "Check Writing",
     "Learning Path", 
     "Progress"]
)

user_input = st.text_area("Your input:")

if st.button("Submit"):
    if mode == "Progress":
        data = orchestrator("progress", user_id=1)
        print(type(data))

        progress = data["progress"]
        mistakes = data["mistakes"]

        st.subheader("📈 Learning Progress")
        if progress: 
            df = pd.DataFrame(progress, columns=["score", "time"])
            st.line_chart(df.set_index("time"))
            st.write(df)
        else:
            st.write("No progress data yet.")

        st.subheader("📊 Mistake Distribution")
        if mistakes:
            mistake_dict = {m[0]: m[1] for m in mistakes}
            st.bar_chart(mistake_dict)
        else:
            st.write("No mistakes recorded.")
    elif mode == "Check Writing":
        user_input = "grading: " + user_input
    elif mode == "Practice":
        user_input = "exericse"
    elif mode == "Learning Path":
        user_input = "curriculum"
    
    response = orchestrator(user_input, user_id=1)
    st.write(response)