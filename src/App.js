import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import ProfileImage from "./components/ProfileImage";
import ChallengeTimer from "./components/ChallengeTimer";

const BACKEND_URL = "http://localhost:5000"; // Change when deploying

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
          setDayStatus(data.dayStatus || {});
          setEmojiData(data.emojiData || {});
          setProfileImage(data.profileImage || null);
        }
      })
      .catch(() => console.log("User not found, starting fresh"));
  }, []); // ✅ Runs only once when the page loads

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
    if (day > passedDays) return; // ✅ Prevent future days from being clicked

    let newStatus = "success"; // ✅ Default first click turns green
    if (dayStatus[day] === "success") {
      setSelectedDay(day);
      setOpenDialog(true); // ✅ Second click opens emoji selection for red
      return; // ✅ Don't update until emoji is selected
    } else if (dayStatus[day] === "fail") {
      newStatus = "success"; // ✅ Third click resets to green
    }

    const updatedDayStatus = { ...dayStatus, [day]: newStatus };

    setDayStatus(updatedDayStatus);

    // ✅ Save Change to MongoDB Immediately
    try {
      await axios.post(`${BACKEND_URL}/save`, {
        userId,
        profileImage,
        dayStatus: updatedDayStatus,
        emojiData,
      });
    } catch (error) {
      console.error("❌ Error saving data:", error);
    }
  };



  const handleSelectEmoji = async (emoji) => {
    if (!selectedDay) return;

    const updatedDayStatus = { ...dayStatus, [selectedDay]: "fail" };
    const updatedEmojiData = { ...emojiData, [selectedDay]: emoji };

    setDayStatus(updatedDayStatus);
    setEmojiData(updatedEmojiData);
    setOpenDialog(false);

    // ✅ Save Change to MongoDB Immediately
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
    <Container>
      <ProfileImage profileImage={profileImage} setProfileImage={setProfileImage} />
      <ChallengeTimer/>

      <Grid container spacing={2} justifyContent="center">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNumber = i + 1;
          const passedDays = getPassedDays();
          const isClickable = dayNumber <= passedDays + 1; // ✅ Allow clicking on today & past days

          return (
            <Grid item key={dayNumber} xs={6} sm={4} md={3} lg={2}>
              <Card
                onClick={() => isClickable && handleStatusChange(dayNumber)} // ✅ Only clickable if day has passed
                sx={{
                  width: 100,
                  height: 120,
                  backgroundColor:
                    dayStatus[dayNumber] === "success"
                      ? "green"
                      : dayStatus[dayNumber] === "fail"
                        ? "red"
                        : "gray",
                  opacity: isClickable ? 1 : 0.3, // ✅ Visually disable future days
                  cursor: isClickable ? "pointer" : "not-allowed",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                }}
              >
                <CardContent>
                  <Typography variant="h5" textAlign="center" color="white">
                    {dayNumber}
                  </Typography>
                  {emojiData[dayNumber] && (
                    <Typography variant="h5" textAlign="center">{emojiData[dayNumber]}</Typography>
                  )}
                </CardContent>
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
