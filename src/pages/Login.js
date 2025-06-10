import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook



//  // const BACKEND_URL = "https://us-central1-challenge-tracker-backend.cloudfunctions.net/api";
const BACKEND_URL = "http://127.0.0.1:5001/challenge-tracker-backend/us-central1/api";
 

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Hook for navigation

  
  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/login`, { email, password });
  
      localStorage.setItem("token", data.token); // Save token
      localStorage.setItem("user", JSON.stringify(data.user)); // Save user to localStorage (optional)
  
      setUser(data.user); // ✅ Set user, not token!
  
      navigate("/"); // ✅ Redirect to main page
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };
  

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)", // Neon glow effect
          background: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#00e5ff", fontWeight: "bold" }}>Login to Your Challenge</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              input: { color: "#fff" },
              label: { color: "#00e5ff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00e5ff" },
                "&:hover fieldset": { borderColor: "#00bcd4" },
                "&.Mui-focused fieldset": { borderColor: "#00e5ff" },
              },
              mb: 2,
            }}
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{
              input: { color: "#fff" },
              label: { color: "#00e5ff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00e5ff" },
                "&:hover fieldset": { borderColor: "#00bcd4" },
                "&.Mui-focused fieldset": { borderColor: "#00e5ff" },
              },
              mb: 2,
            }}
          />
          {error && <Typography color="red">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{
              mt: 2,
              background: "#00e5ff",
              color: "#000",
              "&:hover": { background: "#00bcd4" },
            }}
          >
            Login
          </Button>

          {/* ✅ Signup Button Added */}
          <Typography mt={2}>Don't have an account?</Typography>
          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate("/signup")}
            sx={{
              color: "#00e5ff",
              "&:hover": { color: "#00bcd4" },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
