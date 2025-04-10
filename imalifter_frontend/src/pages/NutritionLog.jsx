// src/pages/NutritionLog.jsx

import FoodLogForm from '../components/FoodLogForm';
import styles from '../styles/Theme.module.css';

/**
 * NutritionLog Page Component
 * This page renders the FoodLogForm component for users to log their meals.
 */
export default function NutritionLog() {
  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Log Nutrition</h2>
      <FoodLogForm />
    </div>
  );
}
