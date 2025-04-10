// src/pages/Register.jsx

import RegisterForm from '../components/RegisterForm';
import styles from '../styles/Theme.module.css';

/**
 * Register Page Component
 * This page renders the RegisterForm component for user registration.
 */
export default function Register() {
  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Register</h2>
      <RegisterForm />
    </div>
  );
}
