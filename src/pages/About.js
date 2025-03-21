import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

const fullText = `
Welcome to the 75-Day Challenge Tracker.

This app is here to help you stay on track with your personal goals and build better habits — one day at a time.

If you miss a day, don’t give up. Be honest with yourself and keep going. The goal is progress, not perfection.

In the future, you'll be able to follow friends and share your journey — only if they accept you to view it. This is especially helpful for those trying to quit addictions or improve themselves quietly but seriously.

Choose your number of challenge days, start small or go big, and let’s begin the journey. Your life is in your hands — make the most of it.
`;

export default function About() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, 25); // Typing speed
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        marginTop: "40px",
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "1.1rem",
        whiteSpace: "pre-line",
        lineHeight: 1.7,
        boxShadow: "0px 0px 15px rgba(0, 174, 255, 0.3)"
      }}
    >
      <Typography>{text}</Typography>
    </Box>
  );
}
