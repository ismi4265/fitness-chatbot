import { useState } from "react";
import { sendRequest } from "../api";

export default function FitnessGoalForm() {
  const [goal, setGoal] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await sendRequest("submit-goal", "POST", { goal });
      setFeedback(data.message || "Goal submitted!");
    } catch (error) {
      setFeedback("Failed to submit goal.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <label className="block mb-2 font-bold">Your Fitness Goal:</label>
      <input
        type="text"
        className="border p-2 w-full"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-500 text-white mt-3 px-4 py-2">
        Submit
      </button>
      {feedback && <p className="mt-2">{feedback}</p>}
    </form>
  );
}
