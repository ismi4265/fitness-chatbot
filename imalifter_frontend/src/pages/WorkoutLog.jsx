import { useState } from "react";
import styles from "../styles/Theme.module.css";

export default function WorkoutLog() {
  const [workout, setWorkout] = useState({
    exercise: "",
    duration: "",
    intensity: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setWorkout({ ...workout, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for API call
    setMessage("Workout logged successfully!");
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Log Workout</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input name="exercise" placeholder="Exercise" value={workout.exercise} onChange={handleChange} required />
        <input name="duration" placeholder="Duration (minutes)" value={workout.duration} onChange={handleChange} required />
        <input name="intensity" placeholder="Intensity (low, medium, high)" value={workout.intensity} onChange={handleChange} required />
        <button type="submit" className={styles.buttonPrimary}>Log Workout</button>
      </form>
      {message && <p className={styles.success}>{message}</p>}
    </div>
  );
}
