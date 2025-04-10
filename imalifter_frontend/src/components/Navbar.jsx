// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar component
 *
 * Displays navigation links to various parts of the app.
 * - Shows Home and Register links when no user is logged in.
 * - Shows Dashboard, Log Workout, Log Nutrition, Profile, and Logout links when user is authenticated.
 * - Uses dynamic styling via `isActive` to highlight the current active route.
 */
export default function Navbar() {
  const { user, logout } = useAuth(); // Get current user and logout method from context
  const navigate = useNavigate(); // React Router's hook to programmatically navigate

  /**
   * Handles logout and navigates to home page.
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      {/* Home link is always visible */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        Home
      </NavLink>

      {/* Register is visible only if user is not logged in */}
      {!user && (
        <NavLink
          to="/register"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          Register
        </NavLink>
      )}

      {/* The following links are only visible when user is logged in */}
      {user && (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/log-workout"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Log Workout
          </NavLink>

          <NavLink
            to="/log-nutrition"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Log Nutrition
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Profile
          </NavLink>

          {/* Logout is a button styled like a link */}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
