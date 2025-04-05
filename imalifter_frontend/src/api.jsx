import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000';

export async function registerUser(username, email, password) {
  const res = await axios.post(`${API_BASE}/register`, { username, email, password });
  return res.data;
}

export async function generateFitnessPlan(user_id, goal, experience_level, dietary_preference) {
  const res = await axios.post(`${API_BASE}/fitness_plan`, {
    user_id,
    goal,
    experience_level,
    dietary_preference,
  });
  return res.data;
}

export async function logFood(user_id, food_name, calories, protein, carbs, fats) {
  const res = await axios.post(`${API_BASE}/log_food`, {
    user_id,
    food_name,
    calories,
    protein,
    carbs,
    fats,
  });
  return res.data;
}

export async function getMealPlan(user_id) {
  const res = await axios.get(`${API_BASE}/get_meal_plan/${user_id}`);
  return res.data;
}
