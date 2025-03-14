import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000"; // Change when deploying

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
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", "user123");

    try {
      const { data } = await axios.post(`${BACKEND_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = `${BACKEND_URL}/${data.imageUrl.replace("\\", "/")}`; // ✅ Fix path issues
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
            border: "4px solid blue",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
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
