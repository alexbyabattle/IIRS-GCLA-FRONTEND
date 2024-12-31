import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Grid,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';



const EditPictureDialog = ({ open, onClose, loadUserDetails }) => {

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


    const handleSave = async () => {
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
            onClose();

        } catch (error) {
            console.error('Error updating profile picture:', error);

        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>EDIT  USER </DialogTitle>
            <DialogContent>

                <Formik
                    initialValues={{
                        file: null, // Default value for file input
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.file) {
                            errors.file = 'File is required';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSave();
                        setSubmitting(false);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            setFieldValue('file', e.target.files[0]);
                                        }}
                                        style={{ marginTop: '10px' }}
                                    />
                                    {errors.file && touched.file && (
                                        <div style={{ color: 'red', marginTop: '5px' }}>{errors.file}</div>
                                    )}
                                </Grid>
                            </Grid>
                            <DialogActions>
                                <Button onClick={onClose} color="secondary" variant="contained">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                >
                                    Submit
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>

            </DialogContent>
        </Dialog>
    );
};

export default EditPictureDialog;
