import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import ProfileImage from "./components/ProfileImage";

const BACKEND_URL = "https://challenge-tracker-backend.onrender.com"; // Change when deploying

export default function App() {
  const userId = "user123"; // Temporary user ID (Replace with real user authentication later)

  const totalDays = 75;
  const challengeStartDate = new Date("2025-03-09T00:00:00Z");

  const [dayStatus, setDayStatus] = useState({});
  const [emojiData, setEmojiData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Load data from MongoDB
    axios.get(`${BACKEND_URL}/load/${userId}`).then(({ data }) => {
      setDayStatus(data.dayStatus || {});
      setEmojiData(data.emojiData || {});
      setProfileImage(data.profileImage || null);
    }).catch(() => console.log("User not found, starting fresh"));
  }, []);

  useEffect(() => {
    // Save data to MongoDB whenever it changes
    if (Object.keys(dayStatus).length > 0) {
      axios.post(`${BACKEND_URL}/save`, {
        userId,
        profileImage,
        dayStatus,
        emojiData
      }).catch(err => console.error("Error saving data", err));
    }
  }, [dayStatus, emojiData, profileImage]);

  const handleStatusChange = (day) => {
    if (dayStatus[day] === "success") {
      setDayStatus((prev) => ({ ...prev, [day]: "pending" }));
    } else if (dayStatus[day] === "fail") {
      setDayStatus((prev) => ({ ...prev, [day]: "success" }));
      setEmojiData((prev) => {
        const newData = { ...prev };
        delete newData[day];
        return newData;
      });
    } else {
      setSelectedDay(day);
      setOpenDialog(true);
    }
  };

  const handleSelectEmoji = (emoji) => {
    setDayStatus((prev) => ({ ...prev, [selectedDay]: "fail" }));
    setEmojiData((prev) => ({ ...prev, [selectedDay]: emoji }));
    setOpenDialog(false);
  };

  return (
    <Container>
      <ProfileImage profileImage={profileImage} setProfileImage={setProfileImage} />
      <Typography variant="h4" color="red" textAlign="center" marginBottom={3}>
        Challenge Countdown
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNumber = i + 1;
          return (
            <Grid item key={dayNumber} xs={6} sm={4} md={3} lg={2}>
              <Card onClick={() => handleStatusChange(dayNumber)}>
                <CardContent>
                  <Typography>{dayNumber}</Typography>
                  {emojiData[dayNumber] && <Typography>{emojiData[dayNumber]}</Typography>}
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
