// src/pages/Register.jsx
import { useState } from "react";
import { registerUser } from "../api";
import styles from "../styles/Theme.module.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(formData.username, formData.email, formData.password);
    setResponse(JSON.stringify(res, null, 2));
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Register</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" className={styles.buttonPrimary}>Register</button>
      </form>
      {response && <pre>{response}</pre>}
    </div>
  );
}
