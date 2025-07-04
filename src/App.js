import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainApp from "./pages/Mainapp";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import axios from "axios";
import About from "./pages/About";
import NeonLoader from "./components/NeonLoader";



// const BACKEND_URL = "https://us-central1-challenge-tracker-backend.cloudfunctions.net/api";
const BACKEND_URL = "http://127.0.0.1:5001/challenge-tracker-backend/us-central1/api";


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
          console.log("app.js User loaded:", res.data);
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
    return <div style={{ color: "#00e5ff", textAlign: "center", marginTop: "2rem" }}>  <NeonLoader /></div>;
  }

  return (
    <>
      {!hideNavbar && <Navbar onLogout={handleLogout} user={user} />}
      <Routes>
      <Route
  path="/"
  element={
    loading
      ? <NeonLoader />
      : user
        ? <MainApp user={user} handleLogout={handleLogout} />
        : <Navigate to="/login" />
  }
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
