import { useState } from "react";
import { logFood } from "../api";
import styles from "../styles/Theme.module.css";

export default function FoodLogForm({ userId, onResponse }) {
  const [form, setForm] = useState({
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const result = await logFood(
        userId,
        form.food_name,
        Number(form.calories),
        Number(form.protein),
        Number(form.carbs),
        Number(form.fats)
      );
      setSuccess("Food logged successfully!");
      setForm({
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
      });
      onResponse(result);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to log food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Log Food</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input
          name="food_name"
          placeholder="Food Name"
          value={form.food_name}
          onChange={handleChange}
          required
        />
        <input
          name="calories"
          placeholder="Calories"
          type="number"
          value={form.calories}
          onChange={handleChange}
          required
        />
        <input
          name="protein"
          placeholder="Protein (g)"
          type="number"
          value={form.protein}
          onChange={handleChange}
          required
        />
        <input
          name="carbs"
          placeholder="Carbs (g)"
          type="number"
          value={form.carbs}
          onChange={handleChange}
          required
        />
        <input
          name="fats"
          placeholder="Fats (g)"
          type="number"
          value={form.fats}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.buttonPrimary}>
          {loading ? "Logging..." : "Log Food"}
        </button>
      </form>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
