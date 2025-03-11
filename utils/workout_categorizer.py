def categorize_workout(goal):
    """
    Categorizes workouts based on the user's goal.
    
    :param goal: str - User's fitness goal (weight loss, muscle gain, maintenance)
    :return: dict - Structured workout recommendations
    """

    workout_types = {
        "strength": [
            {"name": "Squats", "sets": 4, "reps": "8-12", "rest": "60s"},
            {"name": "Deadlifts", "sets": 4, "reps": "6-10", "rest": "90s"},
            {"name": "Bench Press", "sets": 4, "reps": "8-12", "rest": "60s"},
            {"name": "Pull-ups", "sets": 3, "reps": "8-10", "rest": "60s"},
            {"name": "Overhead Press", "sets": 3, "reps": "8-12", "rest": "60s"}
        ],
        "cardio": [
            {"name": "Running", "duration": "30 mins", "intensity": "Moderate"},
            {"name": "Cycling", "duration": "45 mins", "intensity": "High"},
            {"name": "Jump Rope", "duration": "15 mins", "intensity": "High"},
            {"name": "Rowing", "duration": "20 mins", "intensity": "Moderate"},
            {"name": "HIIT Sprints", "duration": "20 mins", "intensity": "High"}
        ],
        "hybrid": [
            {"name": "Kettlebell Swings", "sets": 3, "reps": "15", "rest": "45s"},
            {"name": "Burpees", "sets": 3, "reps": "12", "rest": "30s"},
            {"name": "Box Jumps", "sets": 3, "reps": "10", "rest": "45s"},
            {"name": "Battle Ropes", "duration": "30s", "rest": "30s"},
            {"name": "Rowing Machine", "duration": "15 mins", "intensity": "Moderate"}
        ],
        "progressive_overload": [
            {"name": "Squats", "week_1": "4x8", "week_2": "4x9", "week_3": "4x10", "week_4": "4x11"},
            {"name": "Deadlifts", "week_1": "3x6", "week_2": "3x7", "week_3": "3x8", "week_4": "3x9"},
            {"name": "Bench Press", "week_1": "4x8", "week_2": "4x9", "week_3": "4x10", "week_4": "4x11"},
            {"name": "Overhead Press", "week_1": "3x8", "week_2": "3x9", "week_3": "3x10", "week_4": "3x11"},
            {"name": "Pull-ups", "week_1": "3x8", "week_2": "3x9", "week_3": "3x10", "week_4": "3x11"}
        ]
    }

    if goal == "weight loss":
        return {"primary": workout_types["cardio"], "secondary": workout_types["hybrid"]}
    elif goal == "muscle gain":
        return {"primary": workout_types["strength"], "secondary": workout_types["progressive_overload"]}
    elif goal == "maintenance":
        return {"primary": workout_types["hybrid"], "secondary": workout_types["strength"]}
    else:
        return {"error": "Invalid goal provided."}
