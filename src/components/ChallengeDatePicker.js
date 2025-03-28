import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, Typography, Stack } from "@mui/material";

export default function ChallengeDatePicker({ startDate, endDate, setStartDate, setEndDate }) {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const oneYearAhead = new Date(now);
  oneYearAhead.setFullYear(now.getFullYear() + 1);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          background: "#1a1a1a",
          borderRadius: "10px",
          padding: "1rem",
          width: "100%",
          boxShadow: "0 0 15px rgba(0, 229, 255, 0.3)",
          marginBottom: "1.5rem"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#00e5ff",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1rem",
            textShadow: "0 0 8px #00e5ff"
          }}
        >
          Choose Your Challenge Period
        </Typography>

        <Stack spacing={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            maxDate={now}
            minDate={oneYearAgo}
            sx={{
              svg: { color: "#00e5ff" },
              input: { color: "#fff" },
              label: { color: "#00e5ff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00e5ff" },
                "&:hover fieldset": { borderColor: "#00bcd4" },
                "&.Mui-focused fieldset": { borderColor: "#00e5ff" },
              },
            }}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            minDate={startDate || now}
            maxDate={oneYearAhead}
            sx={{
              svg: { color: "#00e5ff" },
              input: { color: "#fff" },
              label: { color: "#00e5ff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00e5ff" },
                "&:hover fieldset": { borderColor: "#00bcd4" },
                "&.Mui-focused fieldset": { borderColor: "#00e5ff" },
              },
            }}
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
