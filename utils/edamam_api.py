import requests
import os

from dotenv import load_dotenv
load_dotenv()


# Load API keys from environment variables
EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID")  # Set this in your .env or environment
EDAMAM_APP_KEY = os.getenv("EDAMAM_APP_KEY")  # Set this in your .env or environment

BASE_URL = "https://api.edamam.com/api/food-database/v2/parser"

def get_food_data(food_query):
    """Fetch food nutritional data from Edamam API."""
    if not EDAMAM_APP_ID or not EDAMAM_APP_KEY:
        return {"error": "Missing Edamam API credentials. Please set EDAMAM_APP_ID and EDAMAM_APP_KEY."}

    params = {
        "app_id": EDAMAM_APP_ID,
        "app_key": EDAMAM_APP_KEY,
        "ingr": food_query,  # The food item to search
        "nutrition-type": "cooking",
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        return response.json()  # Return food data
    else:
        return {"error": f"Failed to fetch data: {response.json()}"}
