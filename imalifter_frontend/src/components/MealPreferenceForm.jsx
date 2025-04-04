// src/components/MealPreferenceForm.jsx
import { useState } from "react";

export default function MealPreferenceForm() {
  const [mealData, setMealData] = useState({
    preference: "",
    allergies: "",
  });

  const handleChange = (e) =>
    setMealData({ ...mealData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Meal preferences submitted:", mealData);
    // You'd POST to the backend here
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Meal Preferences</h2>
      <input
        name="preference"
        placeholder="Diet (e.g. vegan, paleo)"
        value={mealData.preference}
        onChange={handleChange}
      />
      <input
        name="allergies"
        placeholder="Allergies (comma separated)"
        value={mealData.allergies}
        onChange={handleChange}
      />
      <button type="submit">Save Preferences</button>
    </form>
  );
}
