import openai
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

class ChatGPT:
    def __init__(self, model="gpt-3.5-turbo"):  # ✅ Switch to a cheaper model
        self.model = model
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise ValueError("Missing OpenAI API key. Make sure it's set in .env and loaded.")

        self.client = openai.OpenAI(api_key=api_key)  # ✅ Ensure OpenAI client is correctly initialized

    def chat(self, user_input):
        """Send user input to OpenAI's ChatCompletion API"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,  # ✅ Use the cheaper model
                messages=[{"role": "user", "content": user_input}]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error: {str(e)}"
