import { useState } from "react";
import styles from "../styles/Theme.module.css";

export default function NutritionLog() {
  const [meal, setMeal] = useState({
    food: "",
    calories: "",
    mealType: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for API call
    setMessage("Meal logged successfully!");
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Log Nutrition</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input name="food" placeholder="Food Item" value={meal.food} onChange={handleChange} required />
        <input name="calories" placeholder="Calories" value={meal.calories} onChange={handleChange} required />
        <input name="mealType" placeholder="Meal Type (breakfast, lunch, dinner, snack)" value={meal.mealType} onChange={handleChange} required />
        <button type="submit" className={styles.buttonPrimary}>Log Meal</button>
      </form>
      {message && <p className={styles.success}>{message}</p>}
    </div>
  );
}
