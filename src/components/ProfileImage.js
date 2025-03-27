import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";

// 
// const BACKEND_URL = "https://challenge-tracker-backend.onrender.com"; // Change when deploying
const BACKEND_URL = "http://localhost:5000"; // Change when deploying // Change when deploying
// const BACKEND_URL = "http://localhost:5000"; // Change when deploying

export default function ProfileImage({ userId, profileImage, setProfileImage }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
  
    axios.get(`${BACKEND_URL}/load/${userId}`)
      .then(({ data }) => {
        console.log("✅ Loading profile image:", data.profileImage);
        if (data.profileImage) {
          const fullUrl = data.profileImage;
          if (fullUrl !== profileImage) {
            setProfileImage(fullUrl);
          }
        }
      })
      .catch(err => console.error("❌ Error loading profile image:", err));
  }, [userId, profileImage,setProfileImage]);

  
 const handleImageUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setLoading(true);

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", file); // ✅ field name must be "image"

  try {
    const { data } = await axios.post(`${BACKEND_URL}/api/upload-image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setProfileImage(data.imageUrl);
  } catch (error) {
    console.error("❌ Upload error:", error);
  } finally {
    setLoading(false);
  }
};


  

  return (
    <div style={{ textAlign: "center", cursor: "pointer" }}>
    {profileImage ? (
      <img
        src={profileImage}
        alt="Profile"
        onClick={() => fileInputRef.current.click()}
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "6px solid rgba(0, 174, 255, 0.7)", // ✅ Neon blue border
          boxShadow: "0px 0px 15px rgba(0, 174, 255, 0.5)", // ✅ Glowing effect
          objectFit: "cover", // ensures the image fills the circle nicely
        }}
      />
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={() => fileInputRef.current.click()}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </Button>
    )}
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      accept="image/*"
      onChange={handleImageUpload}
    />
  </div>
  );
}
