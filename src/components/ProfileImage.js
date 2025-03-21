import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000"; // Change when deploying

export default function ProfileImage({ userId, profileImage, setProfileImage }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No userId provided, skipping profile image fetch.");
      return;
    }

    console.log(`🔍 Fetching profile image for user: ${userId}`);

    axios
      .get(`${BACKEND_URL}/load/${userId}`)
      .then(({ data }) => {
        console.log("📸 Profile image data received:", data);
        if (data.profileImage) {
          const imageUrl = `${BACKEND_URL}/${data.profileImage}`;
          console.log("🖼️ Setting profile image:", imageUrl);
          setProfileImage(imageUrl);
        }
      })
      .catch((err) => console.error("❌ Error loading profile image:", err));
  }, [userId, setProfileImage]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      console.error("❌ No file selected.");
      return;
    }

    console.log("📤 Selected file:", file.name, "Size:", file.size, "Type:", file.type);

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    // Debugging FormData
    console.log("📂 FormData content:");
    for (let pair of formData.entries()) {
      console.log(`   🗂️ ${pair[0]}:`, pair[1]);
    }

    // Fetch token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 No token found in localStorage! User might not be authenticated.");
      setLoading(false);
      return;
    }
    console.log("🔑 Using token:", token);
    console.log("BACKEND_URL:", BACKEND_URL);
    console.log("FormData Entries:");
for (let pair of formData.entries()) {
  console.log(pair[0] + ":", pair[1]);
}

    try {
      console.log("🚀 Sending image upload request...");
      const { data } = await axios.post(`${BACKEND_URL}/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("📥 Server response:", data);

      if (!data.imageUrl) {
        console.error("❌ No image URL received from backend.");
        return;
      }

      // Ensure the URL format is correct
      const imageUrl = `${BACKEND_URL}/${data.imageUrl}`;
      console.log("🖼️ Updated image URL:", imageUrl);
      setProfileImage(imageUrl);
    } catch (error) {
      if (error.response) {
        console.error("❌ Server responded with error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("❌ No response from server. Possible CORS issue or server down.");
      } else {
        console.error("❌ Unexpected error:", error.message);
      }
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
