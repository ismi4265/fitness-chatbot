from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from database.models import db, User, FitnessProfile
from database.db_operations import create_user, get_user_by_email, save_fitness_profile, get_fitness_plans_by_user
from chatgpt_wrapper import ChatGPT
from user_input_handler import generate_fitness_prompt

app = Flask(__name__)

import os

# Ensure database path is absolute
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "database", "db.sqlite3")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DATABASE_PATH}"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database with app
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

chatbot = ChatGPT()

@app.route("/register", methods=["POST"])
def register():
    """Handles user registration"""
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if get_user_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    user = create_user(username, email, password)
    return jsonify({"message": "User registered successfully", "user_id": user.id}), 201

@app.route("/fitness_plan", methods=["POST"])
def fitness_plan():
    """Generates & saves a fitness plan"""
    data = request.json
    user_id = data.get("user_id")
    goal = data.get("goal").lower()
    experience_level = data.get("experience_level").lower()
    dietary_preference = data.get("dietary_preference").lower()

    if not user_id or not goal or not experience_level or not dietary_preference:
        return jsonify({"error": "All fields are required"}), 400

    # Generate structured prompt for ChatGPT
    prompt = generate_fitness_prompt(goal, experience_level, dietary_preference)

    # Validate the prompt
    if prompt.startswith("Error"):
        return jsonify({"error": prompt}), 400

    # Get ChatGPT response
    response = chatbot.chat(prompt)

    # Save plan to the database
    save_fitness_profile(user_id, goal, experience_level, dietary_preference, response)

    return jsonify({"message": "Fitness plan saved successfully", "fitness_plan": response})

@app.route("/my_plans/<int:user_id>", methods=["GET"])
def my_plans(user_id):
    """Fetch all fitness plans for a user"""
    plans = get_fitness_plans_by_user(user_id)
    return jsonify([{"goal": p.goal, "plan": p.plan, "created_at": p.created_at} for p in plans])

if __name__ == "__main__":
    app.run(debug=True)
