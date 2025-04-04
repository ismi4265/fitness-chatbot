import { useState } from "react";
import { registerUser } from "../api";

export default function RegisterForm({ onResponse }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(form.username, form.email, form.password);
    onResponse(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register User</h2>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
}
