from flask_sqlalchemy import SQLAlchemy

# Initialize the database
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Hashed password
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class FitnessProfile(db.Model):
    __tablename__ = "fitness_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    goal = db.Column(db.String(50), nullable=False)  # weight loss, muscle gain, maintenance
    experience_level = db.Column(db.String(50), nullable=False)  # beginner, intermediate, advanced
    dietary_preference = db.Column(db.String(50), nullable=False)  # vegan, keto, etc.
    plan = db.Column(db.Text, nullable=True)  # ChatGPT-generated plan
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship("User", backref=db.backref("fitness_profiles", lazy=True))

class UserSession(db.Model):
    __tablename__ = "user_sessions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    session_data = db.Column(db.Text, nullable=True)  # Stores serialized session data
    last_updated = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship("User", backref=db.backref("sessions", lazy=True))

class WorkoutProgress(db.Model):
    __tablename__ = "workout_progress"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    workout_name = db.Column(db.String(100), nullable=False)
    feedback = db.Column(db.String(255), nullable=True)  # e.g., "too easy", "too hard", "just right"
    sets_completed = db.Column(db.Integer, nullable=True)
    reps_completed = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship("User", backref=db.backref("workout_progress", lazy=True))

class MealPlan(db.Model):
    __tablename__ = "meal_plans"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    goal = db.Column(db.String(50), nullable=False)  # weight loss, muscle gain, maintenance
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Float, nullable=False)  # in grams
    carbs = db.Column(db.Float, nullable=False)  # in grams
    fats = db.Column(db.Float, nullable=False)  # in grams
    meal_plan_json = db.Column(db.Text, nullable=False)  # Store as JSON string
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship("User", backref=db.backref("meal_plans", lazy=True))

class FoodItem(db.Model):
    """Stores food items and their nutrition data."""
    __tablename__ = "food_items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    calories = db.Column(db.Float, nullable=False)
    protein = db.Column(db.Float, nullable=False)
    carbs = db.Column(db.Float, nullable=False)
    fats = db.Column(db.Float, nullable=False)
    serving_size = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class UserFoodLog(db.Model):
    """Logs food consumption for users."""
    __tablename__ = "user_food_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey("food_items.id"), nullable=False)
    quantity = db.Column(db.Float, nullable=False)  # Servings consumed
    date_logged = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Fix: Renamed backref to "user_food_entries" to prevent conflicts
    user = db.relationship("User", backref=db.backref("user_food_entries", lazy=True))
    food_item = db.relationship("FoodItem", backref=db.backref("food_logs", lazy=True))

class FoodLog(db.Model):
    """Tracks ad-hoc food logging without predefined items."""
    __tablename__ = "food_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    food_name = db.Column(db.String(255), nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Float, nullable=False)
    carbs = db.Column(db.Float, nullable=False)
    fats = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Fix: Changed backref to "manual_food_logs" to avoid name conflict
    user = db.relationship("User", backref=db.backref("manual_food_logs", lazy=True))
