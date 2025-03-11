from database.models import db, User, FitnessProfile, UserSession, WorkoutProgress
from werkzeug.security import generate_password_hash, check_password_hash

### ------------------------ USER OPERATIONS ------------------------ ###
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
