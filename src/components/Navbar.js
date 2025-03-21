// src/components/Navbar.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button,Typography } from "@mui/material";


const Navbar = ({ onLogout ,user}) => {

  useEffect(() => {
    console.log(user, "user");
  }, [user]);

  return (
    <AppBar
      position="static"
      sx={{
        background: "transparent",
        boxShadow: "none",
        backdropFilter: "blur(12px)",
        borderBottom: "2px solid rgba(0, 255, 255, 0.4)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            sx={{
              color: "#00ffff",
              fontWeight: "bold",
              textShadow: "0 0 6px rgba(0, 255, 255, 0.8)",
            }}
          >
            Home
          </Button>
        </Link>
        <div>
          <Link to="/about" style={{ textDecoration: "none", marginRight: "10px" }}>
            <Button
              sx={{
                color: "#00ffff",
                fontWeight: "bold",
                textShadow: "0 0 6px rgba(0, 255, 255, 0.8)",
              }}
            >
              About
            </Button>
          </Link>
          <Button
            onClick={onLogout}
            sx={{
              color: "#ff4f4f",
              fontWeight: "bold",
              textShadow: "0 0 6px rgba(255, 79, 79, 0.8)",
            }}
          >
            Logout
          </Button>
          <Typography>name</Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
