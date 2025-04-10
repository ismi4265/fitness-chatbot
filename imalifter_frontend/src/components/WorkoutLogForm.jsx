import { useState } from "react";
import styles from "../styles/Theme.module.css";

/**
 * WorkoutLogForm Component
 *
 * This component provides a form to log a user's workout details including
 * exercise name, duration, and intensity. It communicates with the backend API
 * to store the workout and provides feedback for loading, success, and error states.
 *
 * @component
 * @returns {JSX.Element} The rendered WorkoutLogForm component.
 */
export default function WorkoutLogForm() {
  // State for the workout form input fields
  const [workout, setWorkout] = useState({
    exercise: "",
    duration: "",
    intensity: "",
  });

  // State for tracking form submission/loading status
  const [loading, setLoading] = useState(false);

  // State for showing success or error messages
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles input field changes and updates the workout state.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Input change event
   */
  const handleChange = (e) => {
    setWorkout({ ...workout, [e.target.name]: e.target.value });
  };

  /**
   * Submits the workout form by sending a POST request to the backend.
   * Handles success and error feedback.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/log_workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workout),
      });

      if (!response.ok) {
        throw new Error("Failed to log workout");
      }

      setSuccess("Workout logged successfully!");
      setWorkout({ exercise: "", duration: "", intensity: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Log Your Workout</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input
          name="exercise"
          placeholder="Exercise Name"
          value={workout.exercise}
          onChange={handleChange}
          required
        />
        <input
          name="duration"
          type="number"
          placeholder="Duration (minutes)"
          value={workout.duration}
          onChange={handleChange}
          required
        />
        <select
          name="intensity"
          value={workout.intensity}
          onChange={handleChange}
          required
        >
          <option value="">Select Intensity</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className={styles.buttonPrimary}>
          {loading ? "Logging..." : "Log Workout"}
        </button>
      </form>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
