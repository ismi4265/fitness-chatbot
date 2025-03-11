def generate_fitness_prompt(user_goal, experience_level, dietary_preference):
    """
    Generates a structured prompt for ChatGPT based on user goals.
    
    :param user_goal: str - Fitness goal (weight loss, muscle gain, maintenance)
    :param experience_level: str - Beginner, Intermediate, Advanced
    :param dietary_preference: str - Vegan, Vegetarian, Keto, No Preference
    :return: str - Formatted prompt for ChatGPT
    """
    
    goal_descriptions = {
        "weight loss": "Focus on a calorie deficit with a mix of cardio and strength training. Maintain a high-protein diet with balanced macros.",
        "muscle gain": "Focus on a calorie surplus with progressive overload strength training. Maintain a high-protein diet with complex carbs and healthy fats.",
        "maintenance": "Balance calorie intake with regular workouts that include both strength and cardiovascular training. Keep a well-balanced diet."
    }
    
    if user_goal not in goal_descriptions:
        return "Please select a valid goal: weight loss, muscle gain, or maintenance."

    # Construct structured fitness plan request
    prompt = f"""
    I am a {experience_level} level fitness enthusiast with the goal of {user_goal}. 
    I prefer a {dietary_preference} diet. Please provide a structured weekly workout and meal plan 
    based on my goal. Include workout types, sets, reps, and nutrition breakdowns.
    """
    
    return prompt
