from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from datetime import datetime

# Import database models and operations
from database.models import db
import database.db_operations as db_ops
from database.db_operations import (
    save_meal_plan, get_recent_meal_plan, save_session, get_session, clear_session,
    save_workout_feedback, get_recent_feedback, save_food_item, log_food, get_food_log, get_daily_food_log
)

# Import AI and utilities
from chatgpt_wrapper import ChatGPT
from user_input_handler import generate_fitness_prompt, adjust_workout_based_on_feedback
from utils.meal_planner import generate_meal_plan

app = Flask(__name__)

# Ensure database path is absolute
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "database", "db.sqlite3")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DATABASE_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database with app
db.init_app(app)

# Create tables if they don’t exist
with app.app_context():
    db.create_all()

# Initialize ChatGPT wrapper
chatbot = ChatGPT()

# Rate limiting to prevent excessive API usage
limiter = Limiter(get_remote_address, app=app, default_limits=["5 per minute"])

### ------------------------ AUTHENTICATION ROUTES ------------------------ ###
@app.route("/register", methods=["POST"])
def register():
    """Handles user registration"""
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if db_ops.get_user_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    user = db_ops.create_user(username, email, password)
    return jsonify({"message": "User registered successfully", "user_id": user.id}), 201

### ------------------------ FITNESS PLAN ROUTES ------------------------ ###
@app.route("/fitness_plan", methods=["POST"])
@limiter.limit("10 per hour")
def fitness_plan():
    """Generates & saves a fitness plan"""
    data = request.json
    user_id = data.get("user_id")

    session_memory = get_session(user_id)
    if session_memory:
        return jsonify({"message": "Cached response", "fitness_plan": session_memory})

    goal = data.get("goal").lower()
    experience_level = data.get("experience_level").lower()
    dietary_preference = data.get("dietary_preference").lower()

    if not user_id or not goal or not experience_level or not dietary_preference:
        return jsonify({"error": "All fields are required"}), 400

    prompt = f"Generate a fitness plan for {goal}, {experience_level} level, with a {dietary_preference} diet."
    
    response = chatbot.chat(prompt)

    save_session(user_id, response)

    return jsonify({"message": "Fitness plan saved successfully", "fitness_plan": response})

### ------------------------ WORKOUT FEEDBACK ROUTES ------------------------ ###
@app.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    """Receives user workout feedback and stores it."""
    data = request.json
    user_id = data.get("user_id")
    workout_name = data.get("workout_name")
    feedback = data.get("feedback")
    sets_completed = data.get("sets_completed")
    reps_completed = data.get("reps_completed")

    if not user_id or not workout_name or not feedback:
        return jsonify({"error": "Missing required fields"}), 400

    save_workout_feedback(user_id, workout_name, feedback, sets_completed, reps_completed)

    return jsonify({"message": "Feedback saved successfully!"})

### ------------------------ MEAL PLAN ROUTES ------------------------ ###
@app.route("/generate_meal_plan", methods=["POST"])
def generate_meal():
    """Generates a meal plan based on user fitness goals."""
    data = request.json
    user_id = data.get("user_id")
    goal = data.get("goal").lower()

    if not user_id or not goal:
        return jsonify({"error": "User ID and goal are required"}), 400

    meal_plan_json = generate_meal_plan(goal)

    meal_plan = save_meal_plan(
        user_id=user_id,
        goal=goal,
        calories=2200 if goal == "muscle gain" else 1800 if goal == "weight loss" else 2000,
        protein=40, carbs=40, fats=20,
        meal_plan_json=meal_plan_json
    )

    return jsonify({"message": "Meal plan saved successfully!", "meal_plan": meal_plan_json})

@app.route("/get_meal_plan/<int:user_id>", methods=["GET"])
def get_meal_plan(user_id):
    """Fetches the most recent meal plan for a user."""
    meal_plan = get_recent_meal_plan(user_id)
    
    if not meal_plan:
        return jsonify({"error": "No meal plan found"}), 404

    return jsonify({"meal_plan": meal_plan.meal_plan_json})

### ------------------------ FOOD TRACKING ROUTES ------------------------ ###
@app.route("/log_food", methods=["POST"])
def log_food_entry():
    """Logs food intake for a user."""
    data = request.json
    user_id = data.get("user_id")
    food_name = data.get("food_name")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fats = data.get("fats")

    if not user_id or not food_name or calories is None or protein is None or carbs is None or fats is None:
        return jsonify({"error": "All fields are required"}), 400

    food_entry = log_food(user_id, food_name, calories, protein, carbs, fats)
    
    return jsonify({"message": "Food logged successfully!", "food_log_id": food_entry.id})

@app.route("/get_food_log/<int:user_id>", methods=["GET"])
def get_food_log_route(user_id):
    """Fetches a user's food log."""
    food_entries = get_food_log(user_id)

    if not food_entries:
        return jsonify({"error": "No food entries found"}), 404

    return jsonify({"food_log": [
        {
            "food_name": entry.food_name,
            "calories": entry.calories,
            "protein": entry.protein,
            "carbs": entry.carbs,
            "fats": entry.fats,
            "created_at": entry.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for entry in food_entries
    ]})

@app.route("/get_food_log_by_date/<int:user_id>/<string:date>", methods=["GET"])
def get_food_log_by_date(user_id, date):
    """Fetch user's daily food log."""
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    log_data = get_daily_food_log(user_id, date_obj)
    return jsonify(log_data)

### ------------------------ FITNESS PLAN ADJUSTMENT ROUTES ------------------------ ###
@app.route("/get_adjusted_fitness_plan/<int:user_id>", methods=["GET"])
def get_adjusted_fitness_plan(user_id):
    """Dynamically adjusts fitness plan based on meal tracking data."""
    adjustments = db_ops.adjust_fitness_plan_based_on_nutrition(user_id)

    if not adjustments:
        return jsonify({"error": "No fitness profile or meal data found"}), 404

    return jsonify({"message": "Fitness plan adjustments based on nutrition data", "adjustments": adjustments})

### ------------------------ START FLASK SERVER ------------------------ ###
if __name__ == "__main__":
    app.run(debug=True)
