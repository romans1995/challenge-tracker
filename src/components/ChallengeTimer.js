import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

export default function ChallengeTimer({ startDate, endDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start);
    if (!endDate) end.setDate(start.getDate() + 75); // Fallback to 75 days

    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

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
          background: "rgba(0, 0, 0, 0.3)",
          padding: "15px 25px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(0, 255, 255, 0.5)",
          boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.5)",
        }}
      >
        {Object.entries(timeLeft).map(([unit, value], index) => (
          <Box key={index} sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "cyan",
                textShadow: "0px 0px 10px rgba(0, 255, 255, 0.8)",
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
