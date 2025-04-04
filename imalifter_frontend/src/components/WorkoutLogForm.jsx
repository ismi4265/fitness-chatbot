// src/components/WorkoutLogForm.jsx
import { useState } from "react";

export default function WorkoutLogForm() {
  const [data, setData] = useState({
    workout_name: "",
    feedback: "",
    sets: "",
    reps: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Workout log submitted:", data);
    // You'd POST to the backend here
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Workout Log</h2>
      <input
        name="workout_name"
        placeholder="Workout name"
        value={data.workout_name}
        onChange={handleChange}
      />
      <input
        name="feedback"
        placeholder="Feedback"
        value={data.feedback}
        onChange={handleChange}
      />
      <input
        name="sets"
        placeholder="Sets"
        type="number"
        value={data.sets}
        onChange={handleChange}
      />
      <input
        name="reps"
        placeholder="Reps"
        type="number"
        value={data.reps}
        onChange={handleChange}
      />
      <button type="submit">Log Workout</button>
    </form>
  );
}
