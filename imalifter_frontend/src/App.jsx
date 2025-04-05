import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; // Import the Profile component

import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="container">
        <nav style={{
          backgroundColor: '#343a40',
          padding: '0.75rem 1.5rem',
          marginBottom: '2rem'
        }}>
          <Link to="/" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Home</Link>
          <Link to="/register" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Register</Link>
          <Link to="/dashboard" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link> {/* Add Profile link */}
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
        </Routes>
      </div>
    </Router>
  );
}
