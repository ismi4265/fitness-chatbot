import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await sendRequest("login", "POST", formData);
      login(res);
      navigate("/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Login failed. Check email or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Login</button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
