import { useState } from "react";
import { registerUser } from "../api";
import styles from "../styles/Theme.module.css";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        <button type="submit" className={styles.buttonPrimary}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
