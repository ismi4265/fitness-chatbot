from database.models import db, User, FitnessProfile
from werkzeug.security import generate_password_hash, check_password_hash

def create_user(username, email, password):
    """Creates a new user account."""
    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return user

def get_user_by_email(email):
    """Fetch a user by email."""
    return User.query.filter_by(email=email).first()

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
