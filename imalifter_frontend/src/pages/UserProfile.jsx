import { useState } from "react";
import styles from "../styles/Theme.module.css";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    fitnessGoal: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for API call
    setMessage("Profile updated successfully!");
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>User Profile</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input name="age" placeholder="Age" value={profile.age} onChange={handleChange} required />
        <input name="weight" placeholder="Weight (kg)" value={profile.weight} onChange={handleChange} required />
        <input name="height" placeholder="Height (cm)" value={profile.height} onChange={handleChange} required />
        <input name="fitnessGoal" placeholder="Fitness Goal" value={profile.fitnessGoal} onChange={handleChange} required />
        <button type="submit" className={styles.buttonPrimary}>Update Profile</button>
      </form>
      {message && <p className={styles.success}>{message}</p>}
    </div>
  );
}
