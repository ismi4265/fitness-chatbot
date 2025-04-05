import { useState } from "react";
import styles from "../styles/Theme.module.css";

export default function WorkoutLogForm() {
  const [workout, setWorkout] = useState({
    exercise: "",
    duration: "",
    intensity: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setWorkout({ ...workout, [e.target.name]: e.target.value });
  };

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
