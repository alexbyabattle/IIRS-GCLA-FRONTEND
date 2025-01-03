import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { AddToQueue, DoDisturbOn } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import MyFormDialog from './DeviceAssignmentDialog';
import { useTheme } from '@mui/material';
import UnassignDialog from './DeviceUnassignmentDialog';
import image from '../../data/image';

const DeviceDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const [deviceData, setDeviceData] = useState(null);

  const loadDeviceDetails = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    console.log('Fetching device details for ID:', id);

    axios
      .get(`http://localhost:8082/api/v1/device/get/${id}`, config)
      .then((response) => {
        
        const { data } = response.data;
        setDeviceData(data);
      })
      .catch((error) => {
        console.error('Error fetching device details:', error);
        console.error('Full error object:', error);
      });
  };

  useEffect(() => {
    loadDeviceDetails();
  }, [id]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDeviceAssignmentDialog = (deviceId) => {
    setIsDialogOpen(true);
  };


  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);

  const openUserUnassignmentDialog = (deviceId) => {
    setIsUnassignDialogOpen(true);
  };




  return (
    <Box elevation={3}>
      {deviceData && (
        <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px', border: `1px solid ${borderColor}`, marginLeft: "7px", marginRight: "5px" }}>
          <Box
            height="100px"
            sx={{
              padding: 0,
              border: `1px solid ${borderColor}`,
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 0, overflow: 'hidden' }}>
              <img
                alt="gcla admin"
                width="100%"
                height="100px"
                src={image.george}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
            <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" align="center"> <h1>DEVICE DETAILS</h1></Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                justifyContent: 'start'
              }}
            >
              <Typography variant="h6" align="center">ID: {deviceData.id} </Typography>
              <Typography variant="h6" align="center">DATE:  {deviceData.createdAt} </Typography>
            </Box>


          </Box>
          <Box display="flex">
            <Box flex="1">
              <Typography variant="h6">DEVICE DETAILS</Typography>
              <ul>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Device Name:</strong> {deviceData.deviceName}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Device Number:</strong> {deviceData.deviceNumber}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Manufactural:</strong> {deviceData.manufactural}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong style={{ marginRight: '10px' }}>Status:</strong> {deviceData.status}
                  </Typography>
                </li>
              </ul>
            </Box>

            <Box flex="1">
              <ul>
                <strong style={{ marginLeft: '4px' }}>DEVICE REGISTERED BY :</strong>
                {deviceData.users && deviceData.users
                  .filter(user => user.department === 'IT') // Filter users whose department is IT
                  .map((user, index) => (
                    <li key={index}>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}>User Name:</strong> {user.name}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} >Phone Number:</strong> {user.phoneNumber}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} >Location:</strong> {user.location}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }} >Department:</strong> {user.department}
                      </Typography>
                      <Typography variant="body1">
                        <strong style={{ marginRight: '10px' }}>Assigned At:</strong> {user.createdAt}
                      </Typography>
                    </li>
                  ))}
              </ul>
            </Box>

          </Box>
        </Box>
      )}
      {deviceData && (
        <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px', border: `1px solid ${borderColor}`, marginLeft: "7px", marginRight: "5px" }}>
          <Box display="flex" justifyContent="space-between">
            <Box flex="1" marginRight="16px" justifyContent="column">
              <Tooltip title="Assign user to   Device">
                <IconButton color="success" onClick={() => openDeviceAssignmentDialog(deviceData.id)}>
                  <AddToQueue style={{ color: "success", fontSize: 32 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Unassign user from a  Device">
                <IconButton color="success" onClick={() => openUserUnassignmentDialog(deviceData.id)}>
                  <DoDisturbOn style={{ color: "red", fontSize: 32 }} />
                </IconButton>
              </Tooltip>
              <ul>
                <strong style={{ marginLeft: '4px' }}> DEVICE ASSIGNED TO: </strong>
                {deviceData.users && deviceData.users.filter(user => user.department !== 'IT').map((user, index) => (
                  <li key={index}>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}>name:</strong> {user.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} > phoneNumber: </strong> {user.phoneNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }} > department: </strong> {user.department}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}> location: </strong> {user.location}
                    </Typography>
                    <Typography variant="body1">
                      <strong style={{ marginRight: '10px' }}> Assigned At: </strong> {user.createdAt}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
        </Box>
      )}

      <MyFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        loadDeviceDetails={loadDeviceDetails}
        selectedDevices={[id]}
      />

      <UnassignDialog
        open={isUnassignDialogOpen}
        onClose={() => setIsUnassignDialogOpen(false)}
        loadDeviceDetails={loadDeviceDetails}
        selectedDevices={[id]}
      />


     
    </Box>
  );
};

export default DeviceDetails;
