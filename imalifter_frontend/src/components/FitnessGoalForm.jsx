// src/components/FitnessGoalForm.jsx
import { useState } from "react";

export default function FitnessGoalForm() {
  const [formData, setFormData] = useState({
    goal: "",
    experience: "",
    dietary: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Fitness goal submitted:", formData);
    // You'd POST to the backend here
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fitness Goal</h2>
      <label>
        Goal:
        <select name="goal" value={formData.goal} onChange={handleChange}>
          <option value="">Select goal</option>
          <option value="muscle gain">Muscle Gain</option>
          <option value="weight loss">Weight Loss</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </label>

      <label>
        Experience:
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        >
          <option value="">Select level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </label>

      <label>
        Dietary Preference:
        <input
          name="dietary"
          value={formData.dietary}
          onChange={handleChange}
          placeholder="e.g. vegan, keto"
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}
