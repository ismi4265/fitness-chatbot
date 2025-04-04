// src/App.jsx
import { useState } from "react";
import {
  registerUser,
  generateFitnessPlan,
  logFood,
  getMealPlan,
} from "./api";

export default function App() {
  const [userId, setUserId] = useState(1);
  const [response, setResponse] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    goal: "muscle gain",
    experience_level: "beginner",
    dietary_preference: "vegan",
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    const result = await registerUser(
      form.username,
      form.email,
      form.password
    );
    setUserId(result.user_id);
    setResponse(JSON.stringify(result, null, 2));
  };

  const handleFitnessPlan = async () => {
    const result = await generateFitnessPlan(
      userId,
      form.goal,
      form.experience_level,
      form.dietary_preference
    );
    setResponse(JSON.stringify(result, null, 2));
  };

  const handleLogFood = async () => {
    const result = await logFood(
      userId,
      form.food_name,
      parseFloat(form.calories),
      parseFloat(form.protein),
      parseFloat(form.carbs),
      parseFloat(form.fats)
    );
    setResponse(JSON.stringify(result, null, 2));
  };

  const handleMealPlan = async () => {
    const result = await getMealPlan(userId);
    setResponse(JSON.stringify(result, null, 2));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>IMALIFTER Interface</h1>

      <h2>Register User</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
      />
      <button onClick={handleRegister}>Register</button>

      <h2>Generate Fitness Plan</h2>
      <select name="goal" onChange={handleChange}>
        <option value="muscle gain">Muscle Gain</option>
        <option value="weight loss">Weight Loss</option>
        <option value="maintenance">Maintenance</option>
      </select>
      <select name="experience_level" onChange={handleChange}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select name="dietary_preference" onChange={handleChange}>
        <option value="vegan">Vegan</option>
        <option value="keto">Keto</option>
        <option value="omnivore">Omnivore</option>
      </select>
      <button onClick={handleFitnessPlan}>Generate Plan</button>

      <h2>Log Food</h2>
      <input name="food_name" placeholder="Food Name" onChange={handleChange} />
      <input name="calories" placeholder="Calories" onChange={handleChange} />
      <input name="protein" placeholder="Protein" onChange={handleChange} />
      <input name="carbs" placeholder="Carbs" onChange={handleChange} />
      <input name="fats" placeholder="Fats" onChange={handleChange} />
      <button onClick={handleLogFood}>Log Food</button>

      <h2>Meal Plan</h2>
      <button onClick={handleMealPlan}>Get Meal Plan</button>

      <pre>{response}</pre>
    </div>
  );
}
