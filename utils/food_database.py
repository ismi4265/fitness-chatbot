common_foods = {
    "chicken breast": {"calories": 165, "protein": 31, "carbs": 0, "fats": 3.6},
    "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fats": 0.3},
    "egg": {"calories": 78, "protein": 6, "carbs": 0.6, "fats": 5},
    "apple": {"calories": 95, "protein": 0.5, "carbs": 25, "fats": 0.3},
}

def get_food_data_manual(food_name):
    """Fetches food data from a pre-defined dictionary."""
    return common_foods.get(food_name.lower(), {"error": "Food not found."})
