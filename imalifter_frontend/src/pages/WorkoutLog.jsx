// src/pages/WorkoutLog.jsx

import WorkoutLogForm from '../components/WorkoutLogForm';
import styles from '../styles/Theme.module.css';

/**
 * WorkoutLog Page Component
 * This page renders the WorkoutLogForm component for users to log their workouts.
 */
export default function WorkoutLog() {
  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Log Your Workout</h2>
      <WorkoutLogForm />
    </div>
  );
}
