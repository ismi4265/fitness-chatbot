import { useState } from "react";
import { generateFitnessPlan } from "../api";
import styles from "../styles/Theme.module.css";

export default function FitnessPlanForm({ onResponse }) {
  const [form, setForm] = useState({
    user_id: 1,
    goal: "muscle gain",
    experience_level: "beginner",
    dietary_preference: "vegan"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateFitnessPlan(
        form.user_id,
        form.goal,
        form.experience_level,
        form.dietary_preference
      );
      onResponse(res);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      onResponse({ error: "Failed to generate fitness plan" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formWrapper}>
      <h2 className={styles.primaryText}>Generate Fitness Plan</h2>

      <input
        name="user_id"
        type="number"
        value={form.user_id}
        placeholder="User ID"
        onChange={handleChange}
        required
      />
      <input
        name="goal"
        placeholder="Goal (e.g. muscle gain)"
        value={form.goal}
        onChange={handleChange}
        required
      />
      <input
        name="experience_level"
        placeholder="Experience Level"
        value={form.experience_level}
        onChange={handleChange}
        required
      />
      <input
        name="dietary_preference"
        placeholder="Dietary Preference"
        value={form.dietary_preference}
        onChange={handleChange}
        required
      />

      <button type="submit" className={styles.buttonPrimary} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
}
