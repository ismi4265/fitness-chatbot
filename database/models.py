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

    # Relationship to user
    user = db.relationship("User", backref=db.backref("fitness_profiles", lazy=True))

class UserSession(db.Model):
    __tablename__ = "user_sessions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    session_data = db.Column(db.Text, nullable=True)  # Stores serialized session data
    last_updated = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Relationship to user
    user = db.relationship("User", backref=db.backref("sessions", lazy=True))
