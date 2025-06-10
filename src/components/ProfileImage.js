import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import NeonLoader from "./NeonLoader";
import justman from "../assets/justman.png";

// // const BACKEND_URL = "https://us-central1-challenge-tracker-backend.cloudfunctions.net/api";
const BACKEND_URL = "http://127.0.0.1:5001/challenge-tracker-backend/us-central1/api";


export default function ProfileImage({ userId, profileImage, setProfileImage }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Load user data (profile image) on mount
  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/load`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        console.log("✅ Profile image loaded:", data.profileImage);
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading profile image:", err);
      });
  }, [userId, setProfileImage]);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file); // Field name must match multer handler
    const token = localStorage.getItem("token");

    console.log("📤 Uploading file:", file?.name, file?.type, file?.size);
    console.log("📤 FormData entries:", [...formData.entries()]);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Image uploaded:", data.imageUrl);
      setProfileImage(data.imageUrl);
    } catch (error) {
      console.error("❌ Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", cursor: "pointer" }}>
      {loading && <NeonLoader />}
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          onError={(e) => { e.target.src = justman; }}
          onClick={() => fileInputRef.current.click()}
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            border: "6px solid rgba(0, 174, 255, 0.7)",
            boxShadow: "0px 0px 15px rgba(0, 174, 255, 0.5)",
            objectFit: "cover",
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
