import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

// Function to calculate remaining time
const calculateTimeLeft = () => {
  const challengeStartDate = new Date("2025-03-09T00:00:00Z");
  const challengeEndDate = new Date(challengeStartDate);
  challengeEndDate.setDate(challengeStartDate.getDate() + 75); // End date after 75 days

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
};

// Timer component
export default function ChallengeTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());  // Updates the countdown every second
    }, 1000);

    return () => clearInterval(timer); // Cleanup function
  }, []);

  return (
    <Typography variant="h4" color="red" textAlign="center" marginBottom={3}>
      Challenge Countdown: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </Typography>
  );
}
