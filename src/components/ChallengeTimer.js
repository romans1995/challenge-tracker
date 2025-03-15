import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

export default function ChallengeTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const challengeStartDate = new Date("2025-03-09T00:00:00Z");
    const challengeEndDate = new Date(challengeStartDate);
    challengeEndDate.setDate(challengeStartDate.getDate() + 75);

    const now = new Date();
    const difference = challengeEndDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "15px",
          background: "rgba(0, 0, 0, 0.3)", // ✅ Dark background
          padding: "15px 25px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)", // ✅ Subtle glassmorphism effect
          border: "2px solid rgba(0, 255, 255, 0.5)", // ✅ Neon cyan border
          boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.5)", // ✅ Glowing effect
        }}
      >
        {Object.entries(timeLeft).map(([unit, value], index) => (
          <Box key={index} sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "cyan",
                textShadow: "0px 0px 10px rgba(0, 255, 255, 0.8)", // ✅ Neon glow effect
              }}
            >
              {String(value).padStart(2, "0")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
                textTransform: "uppercase",
              }}
            >
              {unit}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
