import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import ProfileImage from "../components/ProfileImage";
import ChallengeTimer from "../components/ChallengeTimer";
import "../App.css";
import justman from '../assets/justman.png';
import NeonLoader from "../components/NeonLoader";

// const BACKEND_URL = "http://localhost:5000"; // Change when deploying
const BACKEND_URL = "https://challenge-tracker-backend.onrender.com"; // Change when deploying

export default function MainApp({ user, setUser }) {
  const [dayStatus, setDayStatus] = useState({});
  const [emojiData, setEmojiData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const saveData = (updatedDayStatus, updatedEmojiData) => {
    if (user?._id) {
      const imagePath = profileImage?.includes("/uploads/")
        ? profileImage.split("/uploads/")[1]
        : null;

      const cleanProfileImage = imagePath ? `${imagePath}` : profileImage;

      const hasImageChanged = cleanProfileImage !== user.profileImage;

      const payload = {
        dayStatus: updatedDayStatus,
        emojiData: updatedEmojiData,
        startDate,
        endDate,
      };

      if (hasImageChanged) {
        payload.profileImage = cleanProfileImage;
      }

      axios.post(`${BACKEND_URL}/save`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(() => console.log("✅ Saving status"))
        .catch(err => console.error("❌ Error saving data:", err))
        .finally(() => console.log("saveData call finished"));
    }
  };

  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL.replace(/\/+\$/, "")}/${imagePath.replace(/^\/+\$/, "")}`;
  };

  useEffect(() => {
    axios.get(`${BACKEND_URL}/load`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(({ data }) => {
        console.log("✅ User data loaded:", data);
        setDayStatus(data.dayStatus || {});
        setEmojiData(data.emojiData || {});
        setProfileImage(buildImageUrl(data.profileImage));

        const defaultStart = new Date("2025-03-09T00:00:00Z");
        const defaultEnd = new Date(defaultStart);
        defaultEnd.setDate(defaultStart.getDate() + 75);

        const start = data.startDate ? new Date(data.startDate) : defaultStart;
        const end = data.endDate ? new Date(data.endDate) : defaultEnd;

        setStartDate(start);
        setEndDate(end);
      })
      .catch(() => {
        console.log("User data not found, starting fresh");
        const defaultStart = new Date("2025-03-09T00:00:00Z");
        const defaultEnd = new Date(defaultStart);
        defaultEnd.setDate(defaultStart.getDate() + 75);
        setStartDate(defaultStart);
        setEndDate(defaultEnd);
      });
  }, []);
  const getPassedDays = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(startDate || "2025-03-09T00:00:00Z");
    start.setHours(0, 0, 0, 0);
    const diff = now - start;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const getTotalDays = () => {
    if (!startDate || !endDate) return 75;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const totalDays = getTotalDays();
  console.log("Total days:", totalDays);

  const handleStatusChange = (day) => {
    const passedDays = getPassedDays();
    if (day > passedDays) return;

    const key = String(day);
    const newDayStatus = { ...dayStatus };
    const updatedEmojiData = { ...emojiData };

    if (dayStatus[key] === "success") {
      setSelectedDay(day);
      setOpenDialog(true);
      return;
    } else {
      newDayStatus[key] = "success";
      updatedEmojiData[key] = "✅";
    }

    setDayStatus(newDayStatus);
    setEmojiData(updatedEmojiData);
    saveData(newDayStatus, updatedEmojiData);
  };

  const handleSelectEmoji = (emoji) => {
    const key = String(selectedDay);
    const updatedDayStatus = { ...dayStatus, [key]: "fail" };
    const updatedEmojiData = { ...emojiData, [key]: emoji };

    setDayStatus(updatedDayStatus);
    setEmojiData(updatedEmojiData);
    setOpenDialog(false);
    saveData(updatedDayStatus, updatedEmojiData);
  };

  if (!user || !startDate || !endDate) return   <NeonLoader />;

  // ... rest of your JSX remains unchanged


  return (
    <Container className="main-container"
      sx={{ paddingLeft: { xs: "16px", md: "0px" }, paddingRight: { xs: "16px", md: "0px" }, marginLeft: "auto" }}>

      <Typography variant="h2" textAlign="center" sx={{
        fontFamily: "'Orbitron', sans-serif",
        background: "linear-gradient(90deg, cyan, #00ffcc, #00ffff, #00ccff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0px 0px 20px rgba(0, 255, 255, 1)",
        letterSpacing: "4px",
        fontWeight: "bold",
        textTransform: "uppercase",
        animation: "pulse 2s infinite alternate",
        fontSize: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5rem" },
        "@keyframes pulse": {
          "0%": { textShadow: "0px 0px 10px rgba(0, 255, 255, 0.6)" },
          "100%": { textShadow: "0px 0px 25px rgba(0, 255, 255, 1)" },
        },
      }}>
        {totalDays} Day Habit Challenge
      </Typography>

      <Typography variant="h5" textAlign="center" sx={{
        fontFamily: "'Poppins', sans-serif",
        color: "rgba(255, 255, 255, 0.8)",
        textShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)",
        letterSpacing: "2px",
        fontWeight: "300",
        marginBottom: "15px",
      }}>
        "Transform Your Life in {totalDays} Days"
      </Typography>

      <ProfileImage userId={user.id} profileImage={profileImage ? profileImage : justman} setProfileImage={setProfileImage} style={{ marginLeft: "auto", marginRight: "auto", padding: "16px" }} />
      <ChallengeTimer startDate={startDate} endDate={endDate} />

      <Grid container spacing={2} justifyContent="center">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNumber = i + 1;
          const passedDays = getPassedDays();
          const isClickable = dayNumber <= passedDays;
          const status = dayStatus[String(dayNumber)];
          const emoji = emojiData[String(dayNumber)];

          return (
            <Grid item key={dayNumber} xs={6} sm={4} md={3} lg={2}>
              <Card
                onClick={() => isClickable && handleStatusChange(dayNumber)}
                sx={{
                  width: "110px",
                  height: "130px",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(8px)",
                  border: `2px solid ${status === "success"
                      ? "rgba(0, 255, 127, 0.6)"
                      : status === "fail"
                        ? "rgba(255, 69, 69, 0.6)"
                        : "rgba(255, 255, 255, 0.3)"
                    }`,
                  boxShadow:
                    status === "success"
                      ? "0px 0px 15px rgba(0, 255, 127, 0.5)"
                      : status === "fail"
                        ? "0px 0px 15px rgba(255, 69, 69, 0.5)"
                        : isClickable
                          ? "0px 4px 10px rgba(0, 255, 255, 0.3)"
                          : "none",
                  cursor: isClickable ? "pointer" : "not-allowed",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "15px",
                  transition: "all 0.3s ease-in-out",
                  position: "relative",
                  "&:hover": {
                    boxShadow:
                      status === "success"
                        ? "0px 0px 20px rgba(0, 255, 127, 0.7)"
                        : status === "fail"
                          ? "0px 0px 20px rgba(255, 69, 69, 0.7)"
                          : "0px 4px 15px rgba(0, 255, 255, 0.5)",
                    transform: isClickable ? "scale(1.05)" : "none",
                  },
                }}
              >
                {isClickable ? (
                  <CardContent>
                    <Typography variant="h5" textAlign="center" color="white">
                      {dayNumber}
                    </Typography>
                    {emoji && (
                      <Typography variant="h5" textAlign="center">
                        {emoji}
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
