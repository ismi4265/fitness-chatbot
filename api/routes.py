from flask import Blueprint, request, jsonify
from datetime import datetime

from database.models import db, User, WorkoutProgress
import database.db_operations as db_ops
from chatgpt_wrapper import ChatGPT
from user_input_handler import generate_fitness_prompt
from utils.meal_planner import generate_meal_plan

api_bp = Blueprint("api", __name__)
chatbot = ChatGPT()

### ------------------------ BASIC FRONTEND ROUTES ------------------------ ###

@api_bp.route("/submit-goal", methods=["POST"])
def submit_goal():
    data = request.json
    goal = data.get("goal", "")
    return jsonify({"message": f"Received your goal: {goal}"}), 200

@api_bp.route("/workout-log", methods=["POST"])
def workout_log():
    data = request.json
    email = data.get("email")
    workout = data.get("workout")

    user = db_ops.get_user_by_email(email)
    if not user:
        return jsonify({"error": "User not found"}), 404

    progress = WorkoutProgress(
        user_id=user.id,
        workout_name=workout,
        feedback="just right",
        sets_completed=0,
        reps_completed=0
    )
    db.session.add(progress)
    db.session.commit()

    return jsonify({"message": "Workout logged successfully!"}), 200

### ------------------------ AUTHENTICATION ------------------------ ###

@api_bp.route("/register", methods=["POST"])
def register():
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

### ------------------------ GPT FITNESS PLAN ------------------------ ###

@api_bp.route("/fitness_plan", methods=["POST"])
def fitness_plan():
    data = request.json
    user_id = data.get("user_id")

    session_memory = db_ops.get_session(user_id)
    if session_memory:
        return jsonify({"message": "Cached response", "fitness_plan": session_memory})

    goal = data.get("goal").lower()
    experience_level = data.get("experience_level").lower()
    dietary_preference = data.get("dietary_preference").lower()

    if not user_id or not goal or not experience_level or not dietary_preference:
        return jsonify({"error": "All fields are required"}), 400

    prompt = f"Generate a fitness plan for {goal}, {experience_level} level, with a {dietary_preference} diet."
    response = chatbot.chat(prompt)

    db_ops.save_session(user_id, response)

    return jsonify({"message": "Fitness plan saved successfully", "fitness_plan": response})

### ------------------------ MEAL PLAN ------------------------ ###

@api_bp.route("/generate_meal_plan", methods=["POST"])
def generate_meal():
    data = request.json
    user_id = data.get("user_id")
    goal = data.get("goal").lower()

    if not user_id or not goal:
        return jsonify({"error": "User ID and goal are required"}), 400

    meal_plan_json = generate_meal_plan(goal)

    db_ops.save_meal_plan(
        user_id=user_id,
        goal=goal,
        calories=2200 if goal == "muscle gain" else 1800 if goal == "weight loss" else 2000,
        protein=40, carbs=40, fats=20,
        meal_plan_json=meal_plan_json
    )

    return jsonify({"message": "Meal plan saved successfully!", "meal_plan": meal_plan_json})

@api_bp.route("/get_meal_plan/<int:user_id>", methods=["GET"])
def get_meal_plan(user_id):
    meal_plan = db_ops.get_recent_meal_plan(user_id)
    if not meal_plan:
        return jsonify({"error": "No meal plan found"}), 404
    return jsonify({"meal_plan": meal_plan.meal_plan_json})

### ------------------------ FOOD LOGGING ------------------------ ###

@api_bp.route("/log_food", methods=["POST"])
def log_food_entry():
    data = request.json
    user_id = data.get("user_id")
    food_name = data.get("food_name")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fats = data.get("fats")

    if not user_id or not food_name or calories is None or protein is None or carbs is None or fats is None:
        return jsonify({"error": "All fields are required"}), 400

    food_entry = db_ops.log_food(user_id, food_name, calories, protein, carbs, fats)
    return jsonify({"message": "Food logged successfully!", "food_log_id": food_entry.id})


@api_bp.route("/get_food_log/<int:user_id>", methods=["GET"])
def get_food_log_route(user_id):
    food_entries = db_ops.get_food_log(user_id)
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

@api_bp.route("/get_adjusted_fitness_plan/<int:user_id>", methods=["GET"])
def get_adjusted_fitness_plan(user_id):
    adjustments = db_ops.adjust_fitness_plan_based_on_nutrition(user_id)
    if not adjustments:
        return jsonify({"error": "No fitness profile or meal data found"}), 404
    return jsonify({"message": "Fitness plan adjustments based on nutrition data", "adjustments": adjustments})

@api_bp.route("/workout-log-view", methods=["POST"])
def view_workout_logs():
    data = request.get_json()
    user_id = data.get("user_id")

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    logs = WorkoutProgress.query.filter_by(user_id=user_id).order_by(WorkoutProgress.created_at.desc()).all()

    return jsonify({
        "workouts": [
            {
                "workout_name": log.workout_name,
                "created_at": log.created_at.strftime("%Y-%m-%d %H:%M")
            }
            for log in logs
        ]
    })


@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = db_ops.get_user_by_email(email)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not db_ops.verify_password(password, user.password):
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    })
