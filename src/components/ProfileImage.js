import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";

export default function ProfileImage() {
  const [image, setImage] = useState(() => localStorage.getItem("profileImage") || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image) {
      localStorage.setItem("profileImage", image);
    }
  }, [image]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ textAlign: "center", cursor: "pointer" }}>
      {image ? (
        <img
          src={image}
          alt="Profile"
          onClick={triggerFileSelect}
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            border: "4px solid blue",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      ) : (
        <Button variant="contained" color="primary" onClick={triggerFileSelect}>
          Upload Image
        </Button>
      )}
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageUpload} />
    </div>
  );
}
