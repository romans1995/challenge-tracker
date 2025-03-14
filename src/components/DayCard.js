import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function DayCard({ day, unlocked, status, onStatusChange }) {
  return (
    <Card
      sx={{
        width: 80,
        height: 100,
        backgroundColor: status === "success" ? "green" : status === "fail" ? "red" : unlocked ? "gray" : "lightgray",
        opacity: unlocked ? 1 : 0.5,
        cursor: unlocked ? "pointer" : "not-allowed",
      }}
      onClick={() => {
        if (unlocked) {
          const newStatus = status === "success" ? "fail" : "success";
          onStatusChange(day, newStatus);
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" textAlign="center">
          {day}
        </Typography>
      </CardContent>
    </Card>
  );
}
