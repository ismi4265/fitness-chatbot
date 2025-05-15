import { useEffect, useState } from "react";
import { sendRequest } from "../api";

export default function Dashboard() {
  const [userId, setUserId] = useState("");
  const [fitnessPlan, setFitnessPlan] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [foodLog, setFoodLog] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setError("");
      try {
        const planRes = await sendRequest(`get_meal_plan/${userId}`);
        setFitnessPlan(planRes.meal_plan || "No plan found.");

        const workoutRes = await sendRequest("workout-log-view", "POST", { user_id: userId });
        setWorkouts(workoutRes.workouts || []);

        const foodRes = await sendRequest(`get_food_log/${userId}`);
        setFoodLog(foodRes.food_log || []);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (e) => setUserId(e.target.value);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <label className="block font-bold mb-2">Enter Your User ID:</label>
      <input
        type="text"
        className="border p-2 w-full mb-6"
        value={userId}
        onChange={handleChange}
        required
      />

      {error && <p className="text-red-600">{error}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Fitness Plan</h2>
        <div className="bg-gray-100 p-3 rounded whitespace-pre-line">{fitnessPlan}</div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Workout Log</h2>
        {workouts.length === 0 ? (
          <p>No workouts found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {workouts.map((w, i) => (
              <li key={i}>{w.workout_name} ({w.created_at})</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Food Log</h2>
        {foodLog.length === 0 ? (
          <p>No food entries found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {foodLog.map((f, i) => (
              <li key={i}>
                {f.food_name}: {f.calories} cal, {f.protein}g P, {f.carbs}g C, {f.fats}g F ({f.created_at})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
