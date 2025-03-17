import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainApp from "./pages/Mainapp";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  // Load user from localStorage on first render
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    
  };

  return (
    <Router>
      <Routes>
        {/* Protected Route - Redirects to login if user is not authenticated */}
        <Route 
          path="/" 
          element={user ? <MainApp  handleLogout={handleLogout} user={user}  /> : <Navigate to="/login" />} 
        />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}
