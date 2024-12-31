import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Notifications } from "@mui/icons-material";
import { Logout } from "@mui/icons-material";
import SignOutDialog from "../Authentication/SignOutDialog";
import { jwtDecode } from 'jwt-decode'; 
import NotificationBarDialog from "../incident/NotificationBarDialog";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const getUserDetailsFromToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        console.log('Decoded Token:', decodedToken);
        const { id, role, department } = decodedToken;
        return { id, role, department };
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  };

  const userDetails = getUserDetailsFromToken();
  

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = () => {
    // Close the logout dialog
    setLogoutDialogOpen(false);
  };


  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  const handleNotificationDialogOpen = () => {
    setNotificationDialogOpen(true);
  };

  const handleNotificationDialogClose = () => {
    setNotificationDialogOpen(false);
  };

  

  const handleUserDetailsOpen = () => {
    const id = userDetails?.id;
    if (id) {
      navigate(`/userDetails/${id}`); 
    } else {
      console.error("User ID not found in local storage");
    }
  };

  


  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
        </Box>

        {/* ICONS */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          
          <IconButton onClick={handleUserDetailsOpen}>
            <PersonOutlinedIcon />
          </IconButton>
          <IconButton onClick={handleNotificationDialogOpen}>
            <Notifications />
          </IconButton>
          <IconButton onClick={handleLogoutDialogOpen}>
            <Logout />
          </IconButton>
        </Box>
      </Box>

      {/* Logout Dialog */}
      <SignOutDialog
        open={logoutDialogOpen}
        onClose={handleLogoutDialogClose}
        onConfirm={handleLogoutConfirm}
        setLogoutDialogOpen={setLogoutDialogOpen} // Pass setLogoutDialogOpen as a prop
      />

      <NotificationBarDialog
        open={notificationDialogOpen}
        onClose={handleNotificationDialogClose}
        
      />


    </>
  );
};

export default Topbar;
