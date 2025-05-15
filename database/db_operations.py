from database.models import db, User, FitnessProfile, UserSession, WorkoutProgress, MealPlan, FoodLog
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func

### ------------------------ USER OPERATIONS ------------------------ ###
import sqlite3

def create_user(name, email, age):
    conn = sqlite3.connect("database/db.sqlite3")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name, email, age) VALUES (?, ?, ?)", (name, email, age))
    conn.commit()
    conn.close()


def get_user_by_email(email):
    """Fetch a user by email."""
    return User.query.filter_by(email=email).first()

### ------------------------ FITNESS PROFILE OPERATIONS ------------------------ ###
def save_fitness_profile(user_id, goal, experience_level, dietary_preference, plan):
    """Saves a user's fitness plan."""
    profile = FitnessProfile(
        user_id=user_id,
        goal=goal,
        experience_level=experience_level,
        dietary_preference=dietary_preference,
        plan=plan
    )
    db.session.add(profile)
    db.session.commit()
    return profile

def get_fitness_plans_by_user(user_id):
    """Retrieve all fitness plans for a user."""
    return FitnessProfile.query.filter_by(user_id=user_id).all()

### ------------------------ SESSION MEMORY OPERATIONS ------------------------ ###
def save_session(user_id, session_data):
    """Saves or updates user session memory."""
    session = UserSession.query.filter_by(user_id=user_id).first()

    if session:
        session.session_data = session_data
    else:
        session = UserSession(user_id=user_id, session_data=session_data)
        db.session.add(session)

    db.session.commit()
    return session

def get_session(user_id):
    """Retrieves stored session memory for a user."""
    session = UserSession.query.filter_by(user_id=user_id).first()
    return session.session_data if session else None

def clear_session(user_id):
    """Clears session memory for a user."""
    session = UserSession.query.filter_by(user_id=user_id).first()
    if session:
        db.session.delete(session)
        db.session.commit()
    return True

### ------------------------ WORKOUT FEEDBACK OPERATIONS ------------------------ ###
def save_workout_feedback(user_id, workout_name, feedback, sets_completed, reps_completed):
    """Saves user workout feedback to track progress and adjust plans."""
    progress = WorkoutProgress(
        user_id=user_id,
        workout_name=workout_name,
        feedback=feedback,
        sets_completed=sets_completed,
        reps_completed=reps_completed
    )
    db.session.add(progress)
    db.session.commit()
    return progress

def get_recent_feedback(user_id):
    """Fetch the most recent workout feedback for a user."""
    return (
        WorkoutProgress.query.filter_by(user_id=user_id)
        .order_by(WorkoutProgress.created_at.desc())
        .limit(5)
        .all()
    )

### ------------------------ MEAL PLAN OPERATIONS ------------------------ ###
def save_meal_plan(user_id, goal, calories, protein, carbs, fats, meal_plan_json):
    """Saves a meal plan for a user."""
    meal_plan = MealPlan(
        user_id=user_id,
        goal=goal,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        meal_plan_json=meal_plan_json
    )
    db.session.add(meal_plan)
    db.session.commit()
    return meal_plan

def get_recent_meal_plan(user_id):
    """Fetch the most recent meal plan for a user."""
    return (
        MealPlan.query.filter_by(user_id=user_id)
        .order_by(MealPlan.created_at.desc())
        .first()
    )


### ------------------------ FOOD TRACKING OPERATIONS ------------------------ ###
def save_food_item(name, calories, protein, carbs, fats, serving_size):
    """Saves food item to the database (if not already saved)."""
    existing_food = FoodItem.query.filter_by(name=name).first()
    if existing_food:
        return existing_food

    food_item = FoodItem(
        name=name,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        serving_size=serving_size
    )
    db.session.add(food_item)
    db.session.commit()
    return food_item

def log_food(user_id, food_name, calories, protein, carbs, fats):
    """Logs a user's food intake."""
    food_entry = FoodLog(
        user_id=user_id,
        food_name=food_name,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats
    )
    db.session.add(food_entry)
    db.session.commit()
    return food_entry

def get_food_log(user_id):
    """Fetch all food logs for a user."""
    return FoodLog.query.filter_by(user_id=user_id).order_by(FoodLog.created_at.desc()).all()


def get_daily_food_log(user_id, date):
    """Retrieve all food logged by a user for a specific date."""
    logs = UserFoodLog.query.filter(
        UserFoodLog.user_id == user_id,
        db.func.date(UserFoodLog.date_logged) == date
    ).all()

    total_calories = sum(log.food_item.calories * log.quantity for log in logs)
    total_protein = sum(log.food_item.protein * log.quantity for log in logs)
    total_carbs = sum(log.food_item.carbs * log.quantity for log in logs)
    total_fats = sum(log.food_item.fats * log.quantity for log in logs)

    return {
        "total_calories": total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fats": total_fats,
        "food_log": [
            {
                "name": log.food_item.name,
                "quantity": log.quantity,
                "calories": log.food_item.calories * log.quantity,
                "protein": log.food_item.protein * log.quantity,
                "carbs": log.food_item.carbs * log.quantity,
                "fats": log.food_item.fats * log.quantity,
            }
            for log in logs
        ],
    }



### ------------------------ MEAL TRACKING ANALYSIS ------------------------ ###
def get_average_nutrient_intake(user_id, days=7):
    """Calculates average daily intake of calories, protein, carbs, and fats over a period (default 7 days)."""
    nutrient_data = (
        db.session.query(
            func.avg(FoodLog.calories).label("avg_calories"),
            func.avg(FoodLog.protein).label("avg_protein"),
            func.avg(FoodLog.carbs).label("avg_carbs"),
            func.avg(FoodLog.fats).label("avg_fats")
        )
        .filter(FoodLog.user_id == user_id)
        .filter(FoodLog.created_at >= func.date_sub(func.now(), func.interval(days, "DAY")))
        .first()
    )

    return {
        "avg_calories": nutrient_data.avg_calories or 0,
        "avg_protein": nutrient_data.avg_protein or 0,
        "avg_carbs": nutrient_data.avg_carbs or 0,
        "avg_fats": nutrient_data.avg_fats or 0,
    }

def adjust_fitness_plan_based_on_nutrition(user_id):
    """Modifies fitness plan based on recent nutrition trends."""
    fitness_profile = FitnessProfile.query.filter_by(user_id=user_id).first()
    if not fitness_profile:
        return None  # No fitness profile found

    nutrient_data = get_average_nutrient_intake(user_id)

    # Define target macros based on goal
    target_macros = {
        "muscle gain": {"calories": 2500, "protein": 150, "carbs": 300, "fats": 80},
        "weight loss": {"calories": 1800, "protein": 120, "carbs": 200, "fats": 60},
        "maintenance": {"calories": 2200, "protein": 130, "carbs": 250, "fats": 70},
    }

    target = target_macros.get(fitness_profile.goal.lower(), target_macros["maintenance"])

    adjustments = {
        "calories": target["calories"] - nutrient_data["avg_calories"],
        "protein": target["protein"] - nutrient_data["avg_protein"],
        "carbs": target["carbs"] - nutrient_data["avg_carbs"],
        "fats": target["fats"] - nutrient_data["avg_fats"],
    }

    return adjustments


def log_workout(email, workout):
    conn = sqlite3.connect("database/db.sqlite3")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO workouts (email, workout) VALUES (?, ?)", (email, workout))
    conn.commit()
    conn.close()


    ### ------------------------ LOGIN ------------------------ ###

from werkzeug.security import check_password_hash

def verify_password(input_password, hashed_password):
    return check_password_hash(hashed_password, input_password)

