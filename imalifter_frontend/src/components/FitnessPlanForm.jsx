import { useState } from "react";
import { generateFitnessPlan } from "../api";
import styles from "../styles/Theme.module.css";

/**
 * FitnessPlanForm Component
 *
 * A reusable form that captures fitness plan preferences from the user,
 * sends the data to the backend to generate a personalized plan,
 * and passes the API response to the parent component via onResponse.
 *
 * @param {Function} onResponse - A callback function to handle the response from the API.
 *
 * State:
 * - form: stores input values for user_id, goal, experience_level, dietary_preference.
 * - loading: shows a loading state while the API request is in progress.
 */
export default function FitnessPlanForm({ onResponse }) {
  const [form, setForm] = useState({
    user_id: 1,
    goal: "muscle gain",
    experience_level: "beginner",
    dietary_preference: "vegan"
  });

  const [loading, setLoading] = useState(false);

  /**
   * Handles change for input fields and updates the form state.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Submits the form data to the backend API.
   * Displays a loading state and handles success or error via the parent callback.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
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
