import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import ProfileImage from "../components/ProfileImage";
import ChallengeTimer from "../components/ChallengeTimer";
// import { v4 as uuidv4 } from "uuid";
import "../App.css";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000"; // ✅ Adjust for production later

export default function MainApp({ user, setUser }) {
  const navigate = useNavigate();
  if(!user) {
    navigate("/login"); // ✅ Redirect to login page
  }
  const totalDays = 75;
  const challengeStartDate = new Date("2025-03-09T00:00:00Z");

 

  const [dayStatus, setDayStatus] = useState({});
  const [emojiData, setEmojiData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
 


  useEffect(() => {
    axios.get(`${BACKEND_URL}/load`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(({ data }) => {
        setDayStatus(data.dayStatus || {});
        setEmojiData(data.emojiData || {});
        setProfileImage(data.profileImage || null); // just set it once
      })
      .catch(() => console.log("User data not found, starting fresh"));
  }, []); // ✅ Added safely with check to prevent loop
  

  useEffect(() => {
    if (Object.keys(dayStatus).length > 0) {
      axios.post(`${BACKEND_URL}/save`, {
        userId: user.id,
        profileImage,
        dayStatus,
        emojiData,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .catch(err => console.error("❌ Error saving data:", err));
    }
  }, [dayStatus, emojiData, profileImage, user.id]);

  const getPassedDays = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(challengeStartDate);
    start.setHours(0, 0, 0, 0);
    const diff = now - start;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const handleStatusChange = (day) => {
    const passedDays = getPassedDays();
    if (day > passedDays) return;

    let newStatus = "success";
    let updatedEmojiData = { ...emojiData };

    if (dayStatus[day] === "success") {
      setSelectedDay(day);
      setOpenDialog(true);
      return;
    } else if (dayStatus[day] === "fail") {
      newStatus = "success";
      updatedEmojiData[day] = "✅"; // ✅ Assign success emoji
    }

    setDayStatus((prev) => ({ ...prev, [day]: newStatus }));
    setEmojiData(updatedEmojiData);
  };

  const handleSelectEmoji = (emoji) => {
    setDayStatus((prev) => ({ ...prev, [selectedDay]: "fail" }));
    setEmojiData((prev) => ({ ...prev, [selectedDay]: emoji }));
    setOpenDialog(false);
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
      <ProfileImage userId={user.id} profileImage={profileImage} setProfileImage={setProfileImage} style = {{marginLeft: "auto", marginRight: "auto", padding: "16px"}} />
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
