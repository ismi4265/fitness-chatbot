import { Link } from "react-router-dom";
import styles from "../styles/Theme.module.css";

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Welcome to IMALIFTER</h2>
      <p className={styles.secondaryText}>
        Your personalized fitness companion. Get custom fitness plans, log your food, and track your progress!
      </p>
      <div className={styles.actionWrapper}>
        <Link to="/register" className={styles.buttonPrimary}>
          Register Now
        </Link>
      </div>
    </div>
  );
}