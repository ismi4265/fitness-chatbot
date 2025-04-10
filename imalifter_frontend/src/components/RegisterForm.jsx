import { useState } from "react";
import { registerUser } from "../api";
import styles from "../styles/Theme.module.css";

/**
 * RegisterForm Component
 *
 * This component provides a user registration form with fields for username, email, and password.
 * It handles form state, submission, and displays success or error messages based on the registration outcome.
 *
 * @component
 * @returns {JSX.Element} The rendered RegisterForm component.
 */
export default function RegisterForm() {
  // State to manage form inputs
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  // State to manage loading status during form submission
  const [loading, setLoading] = useState(false);

  // State to manage success message upon successful registration
  const [success, setSuccess] = useState("");

  // State to manage error message if registration fails
  const [error, setError] = useState("");

  /**
   * Handles changes to form input fields and updates the corresponding state.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object representing the change event.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission by calling the registerUser API function.
   * Manages loading state and displays success or error messages based on the outcome.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The event object representing the form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await registerUser(form.username, form.email, form.password);
      setSuccess("User registered successfully!");
      setForm({ username: "", email: "", password: "" });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Register User</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.buttonPrimary} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
