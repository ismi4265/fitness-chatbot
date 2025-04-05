import { useState } from "react";
import { registerUser } from "../api";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Theme.module.css";

export default function Register() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    setSuccess("");
    setError("");

    try {
      const res = await registerUser(
        formData.username,
        formData.email,
        formData.password
      );
      setSuccess("User registered successfully!");
      setResponse(JSON.stringify(res, null, 2));

      // Automatically log in the user after successful registration
      login({ id: res.user_id, username: formData.username });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Register</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className={styles.buttonPrimary}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Feedback messages */}
      {loading && <p className={styles.loading}>Submitting...</p>}
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}

      {response && <pre className={styles.responseOutput}>{response}</pre>}
    </div>
  );
}
