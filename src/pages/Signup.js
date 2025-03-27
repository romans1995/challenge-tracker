import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook



// const BACKEND_URL = "https://challenge-tracker-backend.onrender.com"; // Change when deploying
const BACKEND_URL = "http://localhost:5000"; // Change when deploying // Change when deploying

export default function Signup({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");



  const handleSignup = async () => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/signup`, { email, password });
      // localStorage.setItem("token", data.token); // ✅ Save token
      // setUser(data.user);
      navigate("/login");

    } catch (err) {
      setError("Signup failed. Try a different email.");
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
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
          background: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#00e5ff", fontWeight: "bold" }}>
            Sign Up for the Challenge
          </Typography>
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
            onClick={handleSignup}
            sx={{
              mt: 2,
              background: "#00e5ff",
              color: "#000",
              "&:hover": { background: "#00bcd4" },
            }}
          >
            Sign Up
          </Button>

          {/* ✅ Back to Login Button */}
          <Typography mt={2}>Already have an account?</Typography>
          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate("/login")}
            sx={{
              color: "#00e5ff",
              "&:hover": { color: "#00bcd4" },
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
