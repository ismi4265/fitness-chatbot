import { useState } from "react";
import { generateFitnessPlan } from "../api";

export default function FitnessPlanForm({ onResponse }) {
  const [form, setForm] = useState({
    user_id: 1,
    goal: "muscle gain",
    experience_level: "beginner",
    dietary_preference: "vegan"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await generateFitnessPlan(
      form.user_id,
      form.goal,
      form.experience_level,
      form.dietary_preference
    );
    onResponse(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Generate Fitness Plan</h2>
      <input name="user_id" placeholder="User ID" type="number" value={form.user_id} onChange={handleChange} />
      <input name="goal" placeholder="Goal (e.g. muscle gain)" onChange={handleChange} />
      <input name="experience_level" placeholder="Experience Level" onChange={handleChange} />
      <input name="dietary_preference" placeholder="Dietary Preference" onChange={handleChange} />
      <button type="submit">Generate</button>
    </form>
  );
}
