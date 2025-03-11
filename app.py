from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

# Import database models and operations
from database.models import db, User, FitnessProfile, UserSession
import database.db_operations as db_ops

# Import AI and utilities
from chatgpt_wrapper import ChatGPT
from user_input_handler import generate_fitness_prompt, adjust_workout_based_on_feedback
from database.db_operations import (
    save_session, get_session, clear_session,
    save_workout_feedback, get_recent_feedback
)

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

    # Check if response is cached
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

    # Save response to avoid multiple calls
    save_session(user_id, response)

    return jsonify({"message": "Fitness plan saved successfully", "fitness_plan": response})

### ------------------------ SESSION MEMORY ROUTES ------------------------ ###
@app.route("/get_session/<int:user_id>", methods=["GET"])
def retrieve_session(user_id):
    """Fetch stored session memory for a user."""
    session_memory = db_ops.get_session(user_id)
    return jsonify({"session_memory": session_memory})


@app.route("/clear_session/<int:user_id>", methods=["DELETE"])
def clear_user_session(user_id):
    """Clears session memory for a user."""
    clear_session(user_id)
    return jsonify({"message": "Session cleared successfully"})

### ------------------------ WORKOUT FEEDBACK ROUTES ------------------------ ###
@app.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    """Receives user workout feedback and stores it."""
    data = request.json
    user_id = data.get("user_id")
    workout_name = data.get("workout_name")
    feedback = data.get("feedback")  # "too easy", "too hard", "just right"
    sets_completed = data.get("sets_completed")
    reps_completed = data.get("reps_completed")

    if not user_id or not workout_name or not feedback:
        return jsonify({"error": "Missing required fields"}), 400

    save_workout_feedback(user_id, workout_name, feedback, sets_completed, reps_completed)

    return jsonify({"message": "Feedback saved successfully!"})

@app.route("/get_adjusted_workout/<int:user_id>/<goal>", methods=["GET"])
def get_adjusted_workout(user_id, goal):
    """Fetches user feedback and adjusts the workout plan dynamically."""
    feedback_list = get_recent_feedback(user_id)
    adjusted_workouts = adjust_workout_based_on_feedback(goal, feedback_list)

    return jsonify({"adjusted_workout": adjusted_workouts})

### ------------------------ START FLASK SERVER ------------------------ ###
if __name__ == "__main__":
    app.run(debug=True)
