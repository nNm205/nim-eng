# 🤖 AI English Tutor – Agentic AI Learning System

## 📌 Overview

This project implements an **Agentic AI system** for personalized English learning.
Instead of a simple chatbot, the system acts as a **virtual tutor** that can:

- Understand student weaknesses
- Provide targeted explanations
- Generate adaptive exercises
- Recommend learning paths
- Track progress over time

👉 The system demonstrates a full **learning feedback loop**:

> **Interaction → Analysis → Adaptation → Evaluation**

---

## 🧠 Key Features

### 🔹 1. Multi-Agent Architecture

- **Q&A Agent** → explains grammar & vocabulary
- **Grading Agent** → corrects writing and gives feedback
- **Exercise Agent** → generates practice exercises
- **Curriculum Agent** → suggests next learning topics
- **Progress Agent** → tracks learning performance

---

### 🔹 2. Memory System

- Stores user interaction history
- Enables **context-aware responses**
- Transforms system from stateless → stateful

---

### 🔹 3. Weakness Detection

- Extracts mistakes from user input
- Classifies errors:
  - grammar
  - tense
  - vocabulary

- Identifies **dominant weaknesses**

---

### 🔹 4. Personalized Learning

- Adapts responses based on user weaknesses
- Generates **targeted explanations and exercises**
- Recommends next lessons dynamically

---

### 🔹 5. Adaptive Exercise Generation

- Automatically selects topics based on user weaknesses
- Creates structured exercises with answers
- Focuses on improving specific skills

---

### 🔹 6. Progress Tracking & Analytics

- Tracks user scores over time
- Visualizes:
  - 📈 Learning progress (line chart)
  - 📊 Mistake distribution (bar chart)

- Provides measurable learning insights

---

## 🏗️ System Architecture

```
User Input
   ↓
Orchestrator Agent
   ↓
Intent Detection
   ↓
----------------------------------
|  QA Agent        | Explanation  |
|  Grading Agent   | Feedback     |
|  Exercise Agent  | Practice     |
|  Curriculum Agent| Planning     |
|  Progress Agent  | Analytics    |
----------------------------------
   ↓
Database (Memory + Progress)
   ↓
Response to User
```

---

## 🔁 Learning Feedback Loop

```
User Input
   ↓
Grading Agent → Detect Mistakes
   ↓
Store in Database
   ↓
Analyze Weakness
   ↓
Adaptive Exercise / Curriculum
   ↓
Progress Tracking
```

---

## 🛠️ Tech Stack

- **Language**: Python
- **Framework**: Streamlit
- **LLM Integration**: Groq / HuggingFace API (free-tier)
- **Database**: SQLite
- **Architecture**: Multi-Agent System
- **Prompt Engineering**: Structured prompts

---

## 📂 Project Structure

```
ai_tutor_agent/
│
├── agents/
│   ├── qa_agent.py
│   ├── grading_agent.py
│   ├── exercise_agent.py
│   ├── curriculum_agent.py
│   ├── progress_agent.py
│
├── core/
│   ├── orchestrator.py
│   ├── router.py
│
├── memory/
│   ├── long_term.py
│
├── prompts/
│   ├── qa_prompt.txt
│   ├── grading_prompt.txt
│   ├── exercise_prompt.txt
│   ├── curriculum_prompt.txt
│   ├── router_prompt.txt
│
├── app/
│   ├── streamlit_app.py
│
├── database/
│   ├── db.sqlite
│
├── utils/
│   ├── helpers.py
│
├── llm/
│   ├── provider.py
│
├── requirements.txt
└── README.md
```

---

## 🚀 How to Run

### 1. Clone repository

```bash
git clone <your_repo_url>
cd ai_tutor_agent
```

---

### 2. Create virtual environment

```bash
python -m venv venv
```

Activate:

**Windows**

```bash
venv\Scripts\activate
```

---

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Setup environment variables

Create `.env`:

```env
GROQ_API_KEY=your_api_key
MODEL_NAME=llama3-8b-8192
PROVIDER=groq
```

---

### 5. Run application

```bash
streamlit run app/streamlit_app.py
```

---

## 🧪 Usage

### 🧑‍🎓 Ask Questions

```
What is present perfect tense?
```

---

### ✍️ Check Writing

```
I go to school yesterday
```

---

### 📘 Practice Exercises

Click **Practice** → system generates exercises automatically

---

### 🧭 Learning Path

Click **Learning Path** → system suggests next lesson

---

### 📊 Progress Dashboard

Click **Progress** → view:

- score over time
- mistake distribution

---

## 🎯 Learning Objectives

This project demonstrates:

- Multi-agent system design
- Prompt engineering
- Memory in AI systems
- Personalized learning
- Feedback loop architecture
- Real-world AI application design

---

## 🔥 Highlights

- ✅ Fully **Agentic AI system** (not just chatbot)
- ✅ **Stateful learning system** with memory
- ✅ **Adaptive learning loop**
- ✅ **Analytics dashboard**
- ✅ Uses **free open-source LLM APIs**

---

## 🚧 Future Improvements

- User authentication (multi-user support)
- Speech-based interaction (Speaking practice)
- Advanced curriculum planning
- RAG (Retrieval-Augmented Generation)
- Export learning reports (PDF)

---

## 👨‍🎓 Author

- Student: _[Your Name]_
- Course: Scientific Project
- Topic: **Agentic AI for Personalized Learning**

---

## 📌 Conclusion

This project goes beyond a traditional chatbot by implementing a **complete Agentic AI learning system** that can:

- Understand users
- Adapt to their needs
- Guide their learning
- Track their progress

👉 It demonstrates how AI can be applied to build **real-world intelligent tutoring systems**.
