import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Container } from "@mui/material";

const BACKEND_URL = "http://localhost:5000"; // Change when deploying

export default function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/signup`, { email, password });
      localStorage.setItem("token", data.token); // ✅ Save token
      setUser(data.user);
    } catch (err) {
      setError("Signup failed. Try a different email.");
    }
  };

  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" color="cyan">Sign Up for the Challenge</Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        {error && <Typography color="red">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleSignup} sx={{ mt: 2 }}>Sign Up</Button>
      </Box>
    </Container>
  );
}
