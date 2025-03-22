import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainApp from "./pages/Mainapp";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import axios from "axios";
import About from "./pages/About";

const BACKEND_URL = "http://localhost:5000"; // Or your deployed URL

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true); // 🆕 Add loading
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${BACKEND_URL}/load`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          console.log("✅ User loaded from backend:", res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.error("❌ Error loading user:", err);
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false); // ✅ Stop loading regardless of outcome
        });
    } else {
      setLoading(false); // ✅ No token, so stop loading
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  if (loading) {
    return <div style={{ color: "#00e5ff", textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  return (
    <>
      {!hideNavbar && <Navbar onLogout={handleLogout} user={user} />}
      <Routes>
  <Route
    path="/"
    element={user ? <MainApp user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />}
  />
  <Route
    path="/login"
    element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
  />
  <Route
    path="/signup"
    element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />}
  />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
</Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
