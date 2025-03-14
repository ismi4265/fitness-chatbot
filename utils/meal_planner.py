import json

def generate_meal_plan(goal):
    """
    Generates a basic meal plan based on fitness goal.
    :param goal: str - weight loss, muscle gain, maintenance
    :return: dict - meal plan details
    """
    
    # Default macro breakdown (adjust as needed)
    macro_ratios = {
        "weight loss": {"protein": 40, "carbs": 30, "fats": 30},
        "muscle gain": {"protein": 35, "carbs": 45, "fats": 20},
        "maintenance": {"protein": 30, "carbs": 40, "fats": 30}
    }

    # Example meals
    meal_templates = {
        "breakfast": ["Oatmeal with almonds", "Scrambled eggs with toast", "Protein shake with banana"],
        "lunch": ["Grilled chicken with quinoa", "Salmon with rice and broccoli", "Tofu stir-fry"],
        "dinner": ["Steak with sweet potatoes", "Lentil soup with veggies", "Grilled shrimp with couscous"],
        "snacks": ["Greek yogurt with honey", "Almond butter on rice cakes", "Mixed nuts and dried fruit"]
    }

    # Select meals for each category
    meal_plan = {
        "goal": goal,
        "calories": 2200 if goal == "muscle gain" else 1800 if goal == "weight loss" else 2000,
        "protein": macro_ratios[goal]["protein"],
        "carbs": macro_ratios[goal]["carbs"],
        "fats": macro_ratios[goal]["fats"],
        "meals": {
            "breakfast": meal_templates["breakfast"][0],
            "lunch": meal_templates["lunch"][1],
            "dinner": meal_templates["dinner"][2],
            "snacks": meal_templates["snacks"][1]
        }
    }

    return json.dumps(meal_plan)
