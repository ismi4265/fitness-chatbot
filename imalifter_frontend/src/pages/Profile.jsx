import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Theme.module.css";

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    // Add other fields as necessary
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${user.id}`);
        const data = await response.json();
        setFormData(data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setMessage("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Profile updated successfully.");
      } else {
        setMessage("Failed to update profile.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Your Profile</h2>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        {/* Add other form fields as necessary */}
        <button type="submit" className={styles.buttonPrimary} disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
