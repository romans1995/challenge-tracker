import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import ProfileImage from "../components/ProfileImage";
import ChallengeTimer from "../components/ChallengeTimer";
import "../App.css";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://challenge-tracker-backend.onrender.com";

export default function MainApp({ user, setUser }) {
  const navigate = useNavigate();
  const totalDays = 75;
  const challengeStartDate = new Date("2025-03-09T00:00:00Z");

  const [dayStatus, setDayStatus] = useState({});
  const [emojiData, setEmojiData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const saveData = (updatedDayStatus, updatedEmojiData) => {
    if (user?._id) {
      // Remove upload folder prefix if needed
      const imagePath = profileImage?.includes("/uploads/")
        ? profileImage.split("/uploads/")[1]
        : null;
  
      const cleanProfileImage = imagePath ? `${imagePath}` : profileImage;
  
      // Check if profile image was changed
      const hasImageChanged = cleanProfileImage !== user.profileImage;
  
      // Build payload
      const payload = {
        dayStatus: updatedDayStatus,
        emojiData: updatedEmojiData,
      };
  
      if (hasImageChanged) {
        payload.profileImage = cleanProfileImage;
      }
      
  
      axios.post(`${BACKEND_URL}/save`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        console.log("✅ Saving status");
      })
      .catch(err => console.error("❌ Error saving data:", err))
      .finally(() => console.log("saveData call finished"));
    }
  };
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
  
    const cleanBackendUrl = BACKEND_URL.replace(/\/+$/, ""); // remove trailing slash
    const filename = imagePath.split("/").pop(); // get just the file name
  
    // If already a full URL and includes /uploads/, return as-is
    if (imagePath.startsWith("http") && imagePath.includes("/uploads/")) {
      return imagePath;
    }
  
    // If full URL but missing /uploads/, fix it
    if (imagePath.startsWith("http")) {
      return `${cleanBackendUrl}/uploads/${filename}`;
    }
  
    // If relative path
    const normalizedPath = imagePath.startsWith("uploads/")
      ? imagePath
      : `uploads/${filename}`;
  
    return `${cleanBackendUrl}/${normalizedPath}`;
  };
  
  useEffect(() => {
    axios.get(`${BACKEND_URL}/load`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(({ data }) => {
        setDayStatus(data.dayStatus || {});
        setEmojiData(data.emojiData || {});
        setProfileImage(buildImageUrl(data.profileImage));
        console.log("✅ User data loaded:", data);
      })
      .catch(() => console.log("User data not found, starting fresh"));
  }, []);

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

  if (!user) return <div>Loading user data...</div>;

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
        75 Day Habit Challenge
      </Typography>

      <Typography variant="h5" textAlign="center" sx={{
        fontFamily: "'Poppins', sans-serif",
        color: "rgba(255, 255, 255, 0.8)",
        textShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)",
        letterSpacing: "2px",
        fontWeight: "300",
        marginBottom: "15px",
      }}>
        "Transform Your Life in 75 Days"
      </Typography>

      <ProfileImage userId={user.id} profileImage={profileImage || "/images/justman.png"} setProfileImage={setProfileImage} style={{ marginLeft: "auto", marginRight: "auto", padding: "16px" }} />
      <ChallengeTimer />

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
                  border: `2px solid ${
                    status === "success"
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
