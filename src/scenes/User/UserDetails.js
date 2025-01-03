import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Snackbar,
  Avatar,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { EditNote, PhotoCamera } from '@mui/icons-material';
//import UserEditForUser from './UserEditForUser';
import { jwtDecode } from 'jwt-decode';
import UserEditForUser from './UserEditForUser';
import EditPictureDialog from './EditPictureDialog';

const UserDetails = () => {

  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const [userData, setUserData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [changeImageDialogOpen, setChangeImageDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [file, setFile] = useState(null);


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
  const id = userDetails?.id;


  const loadUserDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8082/api/v1/users/get/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Response data:', response.data);
      const { data } = response.data;

      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      showSnackbar('error', 'Error fetching user details');
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  

  {/* const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }; */}

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode === '0' ? 'success' : 'error');
    setSnackbarOpen(true);
  };

  const handleOpenChangePictureDialog = () => {
    setChangeImageDialogOpen(true);
  };

  const handleCloseChangePictureDialog = () => {
    setChangeImageDialogOpen(false);
  };

  const handleEditClick = () => {
    setSelectedUserId(id);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };


  {/* const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const formData = new FormData();
      formData.append('id', id);
      formData.append('file', file);

      await axios.put(`http://localhost:8082/api/v1/users/photo`, formData, config);

      loadUserDetails();
      showSnackbar('0', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      showSnackbar('1', 'Error updating profile picture');
    }
  };  */}

  return (
    <Box elevation={3}>
      {userData && (
        <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px', border: `1px solid ${borderColor}`, marginLeft: "7px", marginRight: "5px" }}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                alt={userData?.name || "Profile Picture"}
                src={userData?.photoUrl || userData?.profilePicture}
                sx={{ width: 90, height: 100 }}
              />
              <Tooltip title="choose image">
              <IconButton
                color="primary"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: '20%',
                  right: '30%',
                  transform: 'translate(55%, 55%)',
                  backgroundColor: '#657073'
                }}
                onClick={handleOpenChangePictureDialog}
              >
                <PhotoCamera />
                
              </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Typography variant="body1">
                <strong style={{ marginRight: '10px' }}>UserName:</strong> {userData.name}
              </Typography>
              <Typography variant="body1">
                <strong style={{ marginRight: '10px' }}>Email:</strong> {userData.email}
              </Typography>
              {/* <Button type="submit" color="secondary" variant="contained" onClick={handleSave}>
                  Save
              </Button> */}
            </Box>
          </Box>
          <Tooltip title="Edit your details">
            <IconButton color="info" onClick={handleEditClick}>
              <EditNote sx={{ fontSize: 50 }} />
            </IconButton>
          </Tooltip>
          <Box display="flex">
            <Box flex="1">
              <Typography variant="h6">USER DETAILS</Typography>
              <ul>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Phone Number:</strong> {userData.phoneNumber}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Location:</strong> {userData.location}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Department:</strong> {userData.department}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>CreatedAt:</strong> {userData.createdAt}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Role:</strong> {userData.role}
                  </Typography>
                </li>
              </ul>
            </Box>
            <Box flex="1">
              <ul>
                <strong style={{ marginLeft: '4px' }}>DEVICES OF USER:</strong>
                {userData.devices && userData.devices.map((device, index) => (
                  <li key={index}>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>Device Name:</strong> {device.deviceName}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>Device Number:</strong> {device.deviceNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>Manufacturer:</strong> {device.manufacturer}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>Status:</strong> {device.status}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>Assigned At:</strong> {device.createdAt}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarColor }}
      />

      <UserEditForUser
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        userId={selectedUserId}
      /> 



      

      <EditPictureDialog
        open={changeImageDialogOpen}
        onClose={handleCloseChangePictureDialog}
        userId={selectedUserId}
        loadUserDetails = {loadUserDetails}
      />
    </Box>
  );
};

export default UserDetails;
