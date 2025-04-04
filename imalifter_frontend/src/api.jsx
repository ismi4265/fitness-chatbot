const BASE_URL = "http://127.0.0.1:5000"; // Update this if backend is hosted elsewhere

export async function registerUser(username, email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function generateFitnessPlan(user_id, goal, experience_level, dietary_preference) {
  const res = await fetch(`${BASE_URL}/fitness_plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, goal, experience_level, dietary_preference }),
  });
  return res.json();
}

export async function logFood(user_id, food_name, calories, protein, carbs, fats) {
  const res = await fetch(`${BASE_URL}/log_food`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, food_name, calories, protein, carbs, fats }),
  });
  return res.json();
}

export async function getMealPlan(user_id) {
  const res = await fetch(`${BASE_URL}/get_meal_plan/${user_id}`);
  return res.json();
}