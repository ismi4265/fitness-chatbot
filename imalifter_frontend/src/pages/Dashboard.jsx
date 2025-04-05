// src/pages/Dashboard.jsx
import { useState } from "react";
import { generateFitnessPlan, logFood, getMealPlan } from "../api";
import styles from "../styles/Theme.module.css";

export default function Dashboard() {
  const [userId] = useState(1);
  const [response, setResponse] = useState("");

  const handleFitnessPlan = async () => {
    const res = await generateFitnessPlan(userId, "muscle gain", "beginner", "vegan");
    setResponse(JSON.stringify(res, null, 2));
  };

  const handleLogFood = async () => {
    const res = await logFood(userId, "Oatmeal", 150, 5, 27, 3);
    setResponse(JSON.stringify(res, null, 2));
  };

  const handleMealPlan = async () => {
    const res = await getMealPlan(userId);
    setResponse(JSON.stringify(res, null, 2));
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Dashboard</h2>
      <div className={styles.buttonGroup}>
        <button onClick={handleFitnessPlan} className={styles.buttonPrimary}>Generate Fitness Plan</button>
        <button onClick={handleLogFood} className={styles.buttonPrimary}>Log Food</button>
        <button onClick={handleMealPlan} className={styles.buttonPrimary}>Get Meal Plan</button>
      </div>
      <pre>{response}</pre>
    </div>
  );
}
