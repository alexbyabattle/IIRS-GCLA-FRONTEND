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
    Alert,
    useTheme
} from '@mui/material';
import { tokens } from "../../theme";
import StatBox from '../../components/StatBox';
import { TrafficOutlined } from '@mui/icons-material';

const dialogContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80px',
};

function NotificationBarDialog({ open, onClose, incidentId, loadIncidentDetails, incidentData, loadIncidents }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const updateIncidentStatus = () => {
        console.log('Incident Data:', incidentData);

        const updateStatusEndpoint = `http://localhost:8082/api/incident/status/${incidentId}`;

        const payload = {
            id: incidentId,
            status: incidentData.status === 'PENDING' ? 'SOLVED' : 'PENDING',
        };

        axios
            .put(updateStatusEndpoint, payload)
            .then((response) => {
                if (response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: 'Incident status updated successfully',
                        severity: 'success',
                    });
                    loadIncidentDetails();
                    loadIncidents();
                    onClose();
                } else {
                    setSnackbar({
                        open: true,
                        message: 'Failed to update incident status',
                        severity: 'error',
                    });
                    onClose();
                    console.error('Error: Something went wrong with the API request');
                }
            })
            .catch((error) => {
                console.error('Error updating incident status:', error);
                console.error('Response data:', error.response?.data);
                onClose();
            });
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: {
                        position: 'absolute',
                        top: '50px', // Adjust as per the height of the notifications bar
                        right: '20px',
                        margin: 0,
                    },
                }}
            >
                <DialogContent style={dialogContentStyle}>
                    <Typography variant="body1">ASSIGNED TASKS</Typography>
                    <Box
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title="GCLA"
                            subtitle="device management"
                            
                            increase="priority"
                            icon={
                                <TrafficOutlined
                                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                                />
                            }
                        /> 
                    </Box>

                </DialogContent>
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

export default NotificationBarDialog;
