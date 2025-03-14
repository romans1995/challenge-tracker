import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

export default function ChallengeTimer() {
  // Set the challenge start date (March 9, 2025)
  const challengeStartDate = new Date("2025-03-09T00:00:00Z");

  // Set the challenge end date (75 days after start)
  const challengeEndDate = new Date(challengeStartDate);
  challengeEndDate.setDate(challengeEndDate.getDate() + 75);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const diff = challengeEndDate - now;

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
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Typography variant="h4" color="red" textAlign="center">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </Typography>
  );
}
