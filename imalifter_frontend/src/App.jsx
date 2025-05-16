import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import FitnessPlanForm from "./components/FitnessPlanForm";
import FoodLogForm from "./components/FoodLogForm";
import WorkoutLogForm from "./components/WorkoutLogForm";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/plan"
            element={
              <PrivateRoute>
                <FitnessPlanForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/log-food"
            element={
              <PrivateRoute>
                <FoodLogForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/log-workout"
            element={
              <PrivateRoute>
                <WorkoutLogForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
