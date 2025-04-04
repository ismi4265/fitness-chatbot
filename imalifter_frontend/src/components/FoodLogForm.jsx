import { useState } from "react";
import { logFood } from "../api";

export default function FoodLogForm({ onResponse }) {
  const [form, setForm] = useState({
    user_id: 1,
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await logFood(
      form.user_id,
      form.food_name,
      Number(form.calories),
      Number(form.protein),
      Number(form.carbs),
      Number(form.fats)
    );
    onResponse(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log Food</h2>
      <input name="user_id" placeholder="User ID" type="number" onChange={handleChange} value={form.user_id} />
      <input name="food_name" placeholder="Food Name" onChange={handleChange} />
      <input name="calories" placeholder="Calories" type="number" onChange={handleChange} />
      <input name="protein" placeholder="Protein (g)" type="number" onChange={handleChange} />
      <input name="carbs" placeholder="Carbs (g)" type="number" onChange={handleChange} />
      <input name="fats" placeholder="Fats (g)" type="number" onChange={handleChange} />
      <button type="submit">Log Food</button>
    </form>
  );
}
