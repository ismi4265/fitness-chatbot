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

    def chat_with_fitness_adjustments(user_id, goal):
        """Chats with AI to generate fitness adjustments based on meal tracking data."""
        nutrient_data = adjust_fitness_plan_based_on_nutrition(user_id)

        if not nutrient_data:
            return "No fitness profile or meal data found."

        prompt = f"""
        The user is following a fitness plan for {goal}.
        Based on their food logs, here are their nutritional trends and needed adjustments:
        {generate_fitness_adjustments(goal, nutrient_data)}
        
        Suggest exercise modifications to help them balance their energy and macronutrient intake.
        """

        return chatbot.chat(prompt)
