from config.settings import PROVIDER
from groq import Groq 
import os 

class LLMProvider:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    def generate(self, prompt):
        response = self.client.chat.completions.create(
            model=os.getenv("MODEL_NAME"),
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content 