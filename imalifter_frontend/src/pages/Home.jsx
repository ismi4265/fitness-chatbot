// src/pages/Home.jsx
import FitnessGoalForm from "../components/FitnessGoalForm";
import WorkoutLogForm from "../components/WorkoutLogForm";
import MealPreferenceForm from "../components/MealPreferenceForm";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>IMALIFTER Dashboard</h1>
      <FitnessGoalForm />
      <hr />
      <WorkoutLogForm />
      <hr />
      <MealPreferenceForm />
    </div>
  );
}
