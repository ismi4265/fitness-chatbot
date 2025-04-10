import React, { useState, useEffect } from 'react';
import styles from '../styles/Theme.module.css';

export default function UserProfileForm({ userId }) {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    // Add other personal information fields as needed
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data.');
        }
        const data = await response.json();
        setUserInfo({
          username: data.username,
          email: data.email,
          // Populate other fields as needed
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile.');
      }

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.primaryText}>Update Your Profile</h2>

      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <input
          name="username"
          placeholder="Username"
          value={userInfo.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={handleChange}
          required
        />
        {/* Add other personal information fields as needed */}
        <button type="submit" className={styles.buttonPrimary} disabled={loading}>
          {loading ? 'Updating...' : 'Update Personal Info'}
        </button>
      </form>

      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
