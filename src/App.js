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
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("📦 Token found in localStorage:", token);
  
    if (token && !user) {
      axios.get(`${BACKEND_URL}/load`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          console.log("✅ User loaded from backend:", res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.error("❌ Error loading user:", err);
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, [user]);
  // useEffect(() => {
  //   console.log(user, "user");
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("user");
  //   }
  // }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      {!hideNavbar && <Navbar onLogout={handleLogout} user={user} />}
      <Routes>
        <Route path="/" element={user ? <MainApp user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
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
