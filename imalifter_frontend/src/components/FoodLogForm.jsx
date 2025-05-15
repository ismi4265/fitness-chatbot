import { useState } from "react";
import { sendRequest } from "../api";

import { useAuth } from "../context/AuthContext";




export default function FoodLogForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    user_id: user?.user_id || "",  // <- comes from context
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await sendRequest("log_food", "POST", {
        ...formData,
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fats: parseFloat(formData.fats),
      });
      setMessage(res.message || "Food logged!");
    } catch (err) {
      console.error(err);
      setError("Failed to log food.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Log Food</h2>

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
        name="food_name"
        placeholder="Food Name"
        value={formData.food_name}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <input
        type="number"
        name="calories"
        placeholder="Calories"
        value={formData.calories}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <input
        type="number"
        name="protein"
        placeholder="Protein (g)"
        value={formData.protein}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <input
        type="number"
        name="carbs"
        placeholder="Carbs (g)"
        value={formData.carbs}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <input
        type="number"
        name="fats"
        placeholder="Fats (g)"
        value={formData.fats}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2">
        Log Food
      </button>

      {message && <div className="mt-4 p-3 bg-green-100 rounded">{message}</div>}
      {error && <div className="mt-4 p-3 bg-red-100 rounded text-red-800">{error}</div>}
    </form>
  );
}
