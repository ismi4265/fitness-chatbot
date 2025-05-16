import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sendRequest } from "../api";

export default function Profile() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: user.username,
    email: user.email,
    age: user.age || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendRequest("update-profile", "POST", {
        user_id: user.user_id,
        ...formData
      });
      login(res.updated_user); // update context
      setMessage("Profile updated!");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto border rounded">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 mb-3"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-2 mb-3"
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="w-full border p-2 mb-3"
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2">Update</button>
      {message && <p className="mt-3 text-center">{message}</p>}
    </form>
  );
}
