import openai
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class ChatGPT:
    def __init__(self, model="gpt-4"):
        self.model = model

    def chat(self, user_input):
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[{"role": "user", "content": user_input}],
                api_key=OPENAI_API_KEY
            )
            return response["choices"][0]["message"]["content"].strip()
        except Exception as e:
            return f"Error: {str(e)}"

# Test the chatbot
if __name__ == "__main__":
    chatbot = ChatGPT()
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Chatbot: Goodbye!")
            break
        response = chatbot.chat(user_input)
        print(f"Chatbot: {response}")
