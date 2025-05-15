import { useState } from "react";
import { sendRequest } from "../api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendRequest("register", "POST", formData);
      setMessage(res.message || "User registered!");
    } catch (err) {
      console.error(err);
      setMessage("Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />
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
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
        className="w-full border p-2 mb-3"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Submit</button>
      {message && <p className="mt-3 text-center">{message}</p>}
    </form>
  );
}
