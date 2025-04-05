import { Link } from "react-router-dom";
import styles from "../styles/Theme.module.css";

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Welcome to IMALIFTER</h2>

      <p className={styles.secondaryText}>
        Your personalized fitness companion. Get AI-powered fitness plans, log your meals, and stay on track toward your goals.
      </p>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>What You Can Do:</h3>
        <ul className={styles.featureList}>
          <li>🏋️ Generate fitness plans tailored to your goals</li>
          <li>🍽️ Log your meals with detailed nutrition tracking</li>
          <li>📈 Track your workout feedback and progress</li>
        </ul>
      </div>

      <div className={styles.actionWrapper}>
        <Link to="/register" className={styles.buttonPrimary}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
