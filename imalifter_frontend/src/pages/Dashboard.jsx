import { useState } from "react";
import { generateFitnessPlan, logFood, getMealPlan } from "../api";
import styles from "../styles/Theme.module.css";

export default function Dashboard() {
  const [userId] = useState(1);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleApiCall = async (apiFunc, label) => {
    setLoading(true);
    setError("");
    setSuccess("");
    setResponse("");

    try {
      const res = await apiFunc();
      setSuccess(`${label} completed successfully!`);
      setResponse(JSON.stringify(res, null, 2));
    } catch (err) {
      setError(`Error during ${label.toLowerCase()}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Dashboard</h2>

      <div className={styles.buttonGroup}>
        <button
          onClick={() =>
            handleApiCall(
              () => generateFitnessPlan(userId, "muscle gain", "beginner", "vegan"),
              "Fitness Plan"
            )
          }
          className={styles.buttonPrimary}
        >
          Generate Fitness Plan
        </button>

        <button
          onClick={() =>
            handleApiCall(
              () => logFood(userId, "Oatmeal", 150, 5, 27, 3),
              "Log Food"
            )
          }
          className={styles.buttonPrimary}
        >
          Log Food
        </button>

        <button
          onClick={() => handleApiCall(() => getMealPlan(userId), "Meal Plan")}
          className={styles.buttonPrimary}
        >
          Get Meal Plan
        </button>
      </div>

      {/* Feedback messages */}
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <pre className={styles.responseOutput}>{response}</pre>
    </div>
  );
}
