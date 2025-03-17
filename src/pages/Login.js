import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook

const BACKEND_URL = "http://localhost:5000"; // Change when deploying

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/login`, { email, password });
      localStorage.setItem("token", data.token); // ✅ Save token in localStorage
      setUser(data.user); // ✅ Store user data in state
      navigate("/"); // ✅ Redirect to main page after login
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" color="cyan">Login to Your Challenge</Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        {error && <Typography color="red">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>

        {/* ✅ Signup Button Added */}
        <Typography mt={2}>Don't have an account?</Typography>
        <Button variant="text" color="secondary" onClick={() => navigate("/signup")}>Sign Up</Button>
      </Box>
    </Container>
  );
}
