import { useState } from "react";
import { registerUser, generateFitnessPlan, logFood, getMealPlan } from "./api";

export default function App() {
  const [userId] = useState(1); // ✅ No setter needed if you're not updating it
  const [response, setResponse] = useState("");

  async function handleRegister() {
    const result = await registerUser("testuser", "test@example.com", "secure123");
    setResponse(JSON.stringify(result, null, 2));
  }

  async function handleFitnessPlan() {
    const result = await generateFitnessPlan(userId, "muscle gain", "beginner", "vegan");
    setResponse(JSON.stringify(result, null, 2));
  }

  async function handleLogFood() {
    const result = await logFood(userId, "Oatmeal", 150, 5, 27, 3);
    setResponse(JSON.stringify(result, null, 2));
  }

  async function handleMealPlan() {
    const result = await getMealPlan(userId);
    setResponse(JSON.stringify(result, null, 2));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>IMALIFTER Interface</h1>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleFitnessPlan}>Generate Fitness Plan</button>
      <button onClick={handleLogFood}>Log Food</button>
      <button onClick={handleMealPlan}>Get Meal Plan</button>
      <pre>{response}</pre>
    </div>
  );
}
