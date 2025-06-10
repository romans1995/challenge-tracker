import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChallengeDatePicker from "../components/ChallengeDatePicker";
import ReCAPTCHA from "react-google-recaptcha";


// const BACKEND_URL = "https://us-central1-challenge-tracker-backend.cloudfunctions.net/api";
const BACKEND_URL = "http://127.0.0.1:5001/challenge-tracker-backend/us-central1/api";


export default function Signup({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");


  const handleSignup = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("❌ Please enter a valid email address.");
    }
    if (!password || password.length < 6) {
      return setError("❌ Password must be at least 6 characters.");
    }
    if (!startDate || !endDate) {
      return setError("❌ Please select a challenge start and end date.");
    }
    const diffDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0 || diffDays > 365) {
      return setError("❌ Challenge duration must be between 1 and 365 days.");
    }

    try {
      const {data} = await axios.post(`${BACKEND_URL}/signup`, {
        email,
        password,
        startDate,
        endDate,
        captchaToken,
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("❌ Signup failed. Try a different email.");
    }
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "450px",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 0 25px #00e5ff",
          background: "#0d0d0d",
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#00e5ff", fontWeight: "bold", textShadow: "0 0 10px #00e5ff" }}>
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

          <ChallengeDatePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />

          {error && <Typography color="red" mt={1}>{error}</Typography>}
          <Button
            variant="contained"
            onClick={handleSignup}
            sx={{
              mt: 3,
              width: "100%",
              background: "#00e5ff",
              color: "#000",
              fontWeight: "bold",
              boxShadow: "0 0 10px #00e5ff",
              "&:hover": { background: "#00bcd4", boxShadow: "0 0 15px #00bcd4" },
            }}
          >
            Sign Up
          </Button>

          <Typography mt={3}>Already have an account?</Typography>
          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{
              color: "#00e5ff",
              textShadow: "0 0 5px #00e5ff",
              fontWeight: "bold",
              "&:hover": { color: "#00bcd4" },
            }}
          >
            Login
          </Button>
        </Box>
        <ReCAPTCHA
  sitekey="6Le2dSkrAAAAAD2rxx-UfuxNqyLqVEw9sCdE5N5z"
  onChange={(token) => setCaptchaToken(token)}
/>
      <Box mt={2} textAlign="center">
        <Typography variant="body2" sx={{ color: "#00e5ff" }}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </Box>
      </Box>

    </Container>
  );
}
