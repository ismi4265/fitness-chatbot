import { useState } from "react";
import styles from "../styles/Theme.module.css";

/**
 * MealPreferenceForm Component
 *
 * Allows users to input their dietary restrictions, favorite cuisines, and disliked foods.
 * On submission, it sends this data to the backend endpoint `/meal_preferences` using a POST request.
 * Includes loading indicators, and success/error messages for better user experience.
 */
export default function MealPreferenceForm() {
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: "",
    favoriteCuisines: "",
    dislikedFoods: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles input changes and updates state.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e
   */
  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  /**
   * Submits meal preferences to backend and handles loading/success/error feedback.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/meal_preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to submit meal preferences");
      }

      setSuccess("Meal preferences submitted successfully!");
      setPreferences({
        dietaryRestrictions: "",
        favoriteCuisines: "",
        dislikedFoods: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Meal Preferences</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <textarea
          name="dietaryRestrictions"
          placeholder="Dietary Restrictions"
          value={preferences.dietaryRestrictions}
          onChange={handleChange}
          required
        />
        <textarea
          name="favoriteCuisines"
          placeholder="Favorite Cuisines"
          value={preferences.favoriteCuisines}
          onChange={handleChange}
          required
        />
        <textarea
          name="dislikedFoods"
          placeholder="Disliked Foods"
          value={preferences.dislikedFoods}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.buttonPrimary}>
          {loading ? "Submitting..." : "Submit Preferences"}
        </button>
      </form>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
