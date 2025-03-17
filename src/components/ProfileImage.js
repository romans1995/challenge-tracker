import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";

const BACKEND_URL = "https://challenge-tracker-backend.onrender.com"; // Change when deploying

export default function ProfileImage({ profileImage, setProfileImage }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/load/user123`)
      .then(({ data }) => {
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      })
      .catch(err => console.error("❌ Error loading profile image:", err));
  }, [setProfileImage]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
        const { data } = await axios.post(`${BACKEND_URL}/upload-image`, formData, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" },
        });

        const imageUrl = `${BACKEND_URL}/${data.imageUrl}`; // ✅ Ensure correct URL format
        console.log("🖼️ Image URL:", imageUrl); // ✅ Debugging

        setProfileImage(imageUrl);
    } catch (error) {
        console.error("❌ Error uploading image:", error);
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
          }}
        />
      ) : (
        <Button variant="contained" color="primary" onClick={() => fileInputRef.current.click()} disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </Button>
      )}
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageUpload} />
    </div>
  );
}
