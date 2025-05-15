import { useState } from "react";
import { sendRequest } from "../api";

export default function WorkoutLogForm() {
  const [formData, setFormData] = useState({
    email: "",
    workout: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendRequest("workout-log", "POST", formData);
      setMessage(res.message || "Workout logged!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to log workout.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Log Workout</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />
      <textarea
        name="workout"
        placeholder="Describe your workout..."
        value={formData.workout}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
        rows="4"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2">Submit</button>
      {message && <p className="mt-3 text-center">{message}</p>}
    </form>
  );
}
