import { useState } from "react";
import { generateFitnessPlan } from "../api";
import styles from "../styles/Theme.module.css";

/**
 * FitnessGoalForm Component
 *
 * This component allows a user to set their fitness goal, experience level,
 * and dietary preference. Upon submission, it sends this data to the backend
 * to generate a personalized fitness plan.
 *
 * @param {Object} props
 * @param {number} props.userId - The ID of the user submitting the form.
 * @param {Function} props.onResponse - Callback to handle the API response.
 *
 * @returns {JSX.Element}
 */
export default function FitnessGoalForm({ userId, onResponse }) {
  // Local state to manage form fields
  const [form, setForm] = useState({
    goal: "muscle gain",
    experience_level: "beginner",
    dietary_preference: "vegan",
  });

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /**
   * Updates form field values based on user input.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission by calling the generateFitnessPlan API.
   * Displays success or error message based on the result.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const result = await generateFitnessPlan(
        userId,
        form.goal,
        form.experience_level,
        form.dietary_preference
      );
      setSuccess("Fitness plan generated successfully!");
      onResponse(result);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to generate fitness plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Set Your Fitness Goals</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        {/* Goal Input */}
        <label className={styles.label}>
          Goal:
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="muscle gain">Muscle Gain</option>
            <option value="weight loss">Weight Loss</option>
            <option value="endurance">Endurance</option>
          </select>
        </label>

        {/* Experience Level Input */}
        <label className={styles.label}>
          Experience Level:
          <select
            name="experience_level"
            value={form.experience_level}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        {/* Dietary Preference Input */}
        <label className={styles.label}>
          Dietary Preference:
          <select
            name="dietary_preference"
            value={form.dietary_preference}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="omnivore">Omnivore</option>
          </select>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.buttonPrimary}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>

      {/* Success or Error Messages */}
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
