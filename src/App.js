import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import ProfileImage from "./components/ProfileImage";
import ChallengeTimer from "./components/ChallengeTimer";

import "./App.css";

// import blockedImg from "./assets/blocked.jpg";

const BACKEND_URL = "https://challenge-tracker-backend.onrender.com"; // Change when deploying

export default function App() {
  const userId = "user123"; // Temporary user ID (Replace with real user authentication later)

  const totalDays = 75;
  const challengeStartDate = new Date("2025-03-09T00:00:00Z");
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

  const [dayStatus, setDayStatus] = useState({});
  const [emojiData, setEmojiData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Load data from MongoDB
    axios.get(`${BACKEND_URL}/load/${userId}`).then(({ data }) => {
      setDayStatus(data.dayStatus || {});
      setEmojiData(data.emojiData || {});
      setProfileImage(data.profileImage || null);
    }).catch(() => console.log("User not found, starting fresh"));
  }, []);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/load/${userId}`)
      .then(({ data }) => {
        if (data) {
          setDayStatus(data.dayStatus || {}); // ✅ Load saved card status
          setEmojiData(data.emojiData || {}); // ✅ Load saved emoji data
          setProfileImage(data.profileImage || null);
        }
      })
      .catch(err => console.error("❌ Error loading data:", err));
  }, []);

  const getPassedDays = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Remove time from today to avoid time-based issues
    const challengeStart = new Date(challengeStartDate);
    challengeStart.setHours(0, 0, 0, 0); // Remove time from start date

    const difference = now - challengeStart;
    const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));

    return daysPassed < 0 ? 0 : daysPassed; // Ensure we don't return negative numbers
  };


  const handleStatusChange = async (day) => {
    const passedDays = getPassedDays();
    if (day > passedDays) return; // ✅ Prevent clicking future days
  
    let newStatus = "success"; // ✅ First click turns green
    let updatedEmojiData = { ...emojiData };
  
    if (dayStatus[day] === "success") {
      setSelectedDay(day);
      setOpenDialog(true); // ✅ Second click opens emoji selection
      return;
    } else if (dayStatus[day] === "fail") {
      newStatus = "success"; // ✅ Third click resets to green
      updatedEmojiData[day] = "success"; // ✅ Assign success emoji 🎉
    }
  
    const updatedDayStatus = { ...dayStatus, [day]: newStatus };
  
    // ✅ Remove the failure emoji when switching to success
    if (newStatus === "success") {
      updatedEmojiData[day] = "✅"; // ✅ Replace fail emoji with success emoji
    }
  
    setDayStatus(updatedDayStatus);
    setEmojiData(updatedEmojiData);
  
    // ✅ Save Changes to MongoDB
    try {
      await axios.post(`${BACKEND_URL}/save`, {
        userId,
        profileImage,
        dayStatus: updatedDayStatus,
        emojiData: updatedEmojiData,
      });
    } catch (error) {
      console.error("❌ Error saving card data:", error);
    }
  };
  



  const handleSelectEmoji = async (emoji) => {
    if (!selectedDay) return;
  
    const updatedDayStatus = { ...dayStatus, [selectedDay]: "fail" };
    const updatedEmojiData = { ...emojiData, [selectedDay]: emoji };
  
    setDayStatus(updatedDayStatus);
    setEmojiData(updatedEmojiData);
    setOpenDialog(false);
  
    // ✅ Save Changes to MongoDB
    try {
      await axios.post(`${BACKEND_URL}/save`, {
        userId,
        profileImage,
        dayStatus: updatedDayStatus,
        emojiData: updatedEmojiData,
      });
    } catch (error) {
      console.error("❌ Error saving emoji data:", error);
    }
  };


  return (
    <Container  className="main-container"
    sx={{
      paddingLeft: { xs: "16px", md: "0px" },
      paddingRight: { xs: "16px", md: "0px" },
      marginLeft: "auto",
    }}>
     <Typography
  variant="h2"
  textAlign="center"
  sx={{
    fontFamily: "'Orbitron', sans-serif",
    background: "linear-gradient(90deg, cyan, #00ffcc, #00ffff, #00ccff)", // ✅ Neon gradient
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 0px 20px rgba(0, 255, 255, 1)", // ✅ Strong neon glow
    letterSpacing: "4px",
    fontWeight: "bold",
    textTransform: "uppercase",
    animation: "pulse 2s infinite alternate",
    fontSize: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5rem" }, // ✅ Responsive font size
    "@keyframes pulse": {
      "0%": { textShadow: "0px 0px 10px rgba(0, 255, 255, 0.6)" },
      "100%": { textShadow: "0px 0px 25px rgba(0, 255, 255, 1)" },
    },
  }}
>
  75 Day Habit Challenge
</Typography>
<Typography
  variant="h5"
  textAlign="center"
  sx={{
    fontFamily: "'Poppins', sans-serif",
    color: "rgba(255, 255, 255, 0.8)",
    textShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)",
    letterSpacing: "2px",
    fontWeight: "300",
    marginBottom: "15px",
  }}
>
  "Transform Your Life in 75 Days"
</Typography>
      <ProfileImage profileImage={profileImage} setProfileImage={setProfileImage} style = {{marginLeft: "auto", marginRight: "auto", padding: "16px"}} />
      <ChallengeTimer/>

      <Grid container spacing={2} justifyContent="center">
  {Array.from({ length: totalDays }, (_, i) => {
    const dayNumber = i + 1;
    const passedDays = getPassedDays();
    const isClickable = dayNumber <= passedDays; // ✅ Only past days are clickable

    return (
      <Grid item key={dayNumber} xs={6} sm={4} md={3} lg={2}>
        <Card
          onClick={() => isClickable && handleStatusChange(dayNumber)}
          sx={{
            width: "110px",
            height: "130px",
            background: "rgba(255, 255, 255, 0.15)", // ✅ Subtle glass effect
            backdropFilter: "blur(8px)", // ✅ Soft blur for glass effect
            border: `2px solid ${
              dayStatus[dayNumber] === "success"
                ? "rgba(0, 255, 127, 0.6)" // ✅ Green glow for success
                : dayStatus[dayNumber] === "fail"
                ? "rgba(255, 69, 69, 0.6)" // ✅ Red glow for fail
                : "rgba(255, 255, 255, 0.3)"
            }`,
            boxShadow:
              dayStatus[dayNumber] === "success"
                ? "0px 0px 15px rgba(0, 255, 127, 0.5)" // ✅ Green glow shadow
                : dayStatus[dayNumber] === "fail"
                ? "0px 0px 15px rgba(255, 69, 69, 0.5)" // ✅ Red glow shadow
                : isClickable
                ? "0px 4px 10px rgba(0, 255, 255, 0.3)" // ✅ Default soft neon glow
                : "none",
            cursor: isClickable ? "pointer" : "not-allowed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "15px",
            transition: "all 0.3s ease-in-out",
            position: "relative", // ✅ Allows overlay effect
            "&:hover": {
              boxShadow:
                dayStatus[dayNumber] === "success"
                  ? "0px 0px 20px rgba(0, 255, 127, 0.7)"
                  : dayStatus[dayNumber] === "fail"
                  ? "0px 0px 20px rgba(255, 69, 69, 0.7)"
                  : "0px 4px 15px rgba(0, 255, 255, 0.5)",
              transform: isClickable ? "scale(1.05)" : "none",
            },
          }}
        >
          {isClickable ? (
            <CardContent 
            >
              <Typography variant="h5" textAlign="center" color="white">
                {dayNumber}
              </Typography>
              {emojiData[dayNumber] && (
                <Typography variant="h5" textAlign="center">
                  {emojiData[dayNumber]}
                </Typography>
              )}
            </CardContent>
          ) : (
            <img
              src="/images/blocked.webp"
              alt="Blocked"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          )}
        </Card>
      </Grid>
    );
  })}
</Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select a reason</DialogTitle>
        <DialogContent>
          {["💧", "🏃", "🍔", "📖"].map((emoji) => (
            <Button key={emoji} onClick={() => handleSelectEmoji(emoji)}>{emoji}</Button>
          ))}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
