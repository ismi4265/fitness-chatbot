// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        Home
      </NavLink>

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

          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
