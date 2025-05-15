import { useState } from "react";
import { sendRequest } from "../api";

import { useAuth } from "../context/AuthContext";



export default function FitnessPlanForm() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    user_id: user?.user_id || "",  // <- comes from context
    goal: "",
    experience_level: "",
    dietary_preference: "",
  });
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await sendRequest("fitness_plan", "POST", formData);
      setResponse(res.fitness_plan || "Plan generated!");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to generate plan.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Generate Fitness Plan</h2>

      <input
        type="text"
        name="user_id"
        placeholder="User ID"
        value={formData.user_id}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <input
        type="text"
        name="goal"
        placeholder="e.g. muscle gain, weight loss"
        value={formData.goal}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <input
        type="text"
        name="experience_level"
        placeholder="e.g. beginner, intermediate"
        value={formData.experience_level}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <input
        type="text"
        name="dietary_preference"
        placeholder="e.g. vegan, keto, none"
        value={formData.dietary_preference}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <button type="submit" className="bg-purple-600 text-white px-4 py-2">
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {response && <div className="mt-4 p-3 bg-green-100 rounded">{response}</div>}
      {error && <div className="mt-4 p-3 bg-red-100 rounded text-red-800">{error}</div>}
    </form>
  );
}
