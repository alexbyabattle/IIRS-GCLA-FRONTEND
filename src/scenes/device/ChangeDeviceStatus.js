import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Snackbar,
    Alert
} from '@mui/material';

const dialogContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80px',
};

function ChangeStatusDialog({ open, onClose, deviceId, loadIncidentDetails, incidentData }) {

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const updateDeviceStatus = () => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            console.error('Access token not found in local storage');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const updateStatusEndpoint = `http://localhost:8082/api/v1/device/status/${deviceId}`;

        // Check if incidentData and incidentData.devices exist
        if (!incidentData || !incidentData.devices || incidentData.devices.length === 0) {
            console.error('No devices found or incident data is missing.');
            return;
        }

        // Define the payload to be sent with the PUT request
        const payload = {
            id: deviceId,
            status: incidentData.devices.map(device => device.status).includes('FAULT') ? 'FINE' : 'FAULT'
        };

        // Make an HTTP PUT request to update the device status
        axios
            .put(updateStatusEndpoint, payload, config)
            .then((response) => {
                // Check if the status code is 200 (OK)
                if (response.status === 200) {
                    console.log('Device status updated successfully');
                    // Show success snackbar
                    setSnackbar({
                        open: true,
                        message: "device's status  Updated successfully",
                        severity: 'success',
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: "failed to upadate device status",
                        severity: 'error',
                    });
                }

                // Refresh the incident details and close the dialog
                loadIncidentDetails();
                onClose();
            })
            .catch((error) => {
                // Handle any errors
                console.error('Error updating device status:', error);
                console.error('Response data:', error.response?.data);

                onClose();
            });
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogContent style={dialogContentStyle}>
                    <Typography variant="body1">
                        Do you want to change the device status?
                    </Typography>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="center" mt="20px">
                        <Button onClick={updateDeviceStatus} color="error" variant="contained">
                            OK
                        </Button>
                    </Box>
                    <Box display="flex" justifyContent="center" mt="20px">
                        <Button onClick={onClose} color="secondary" variant="contained">
                            Cancel
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
            {/* Snackbar for feedback messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ChangeStatusDialog;
