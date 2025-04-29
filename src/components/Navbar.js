import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


const Navbar = ({ onLogout, user }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(user, "user");
  }, [user]);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

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
        {/* Toggle button */}
        <IconButton onClick={toggleMenu} sx={{ color: "#00ffff" }}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Always show logout + email */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          <Typography
            sx={{
              display: "inline-flex",
              width: "100px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#00ffff",
              fontWeight: "bold",
            }}
          >
            {user?.email}
          </Typography>
        </Box>
      </Toolbar>

      {/* Expanded nav links */}
      {open && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: "20px", paddingBottom: "10px" }}>
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
          <Link to="/about" style={{ textDecoration: "none" }}>
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
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
