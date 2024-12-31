import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';


const initialValues = {
  deviceName: '',
  deviceNumber: '',
  manufactural: '',
  selectedUsers: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  deviceName: yup.string().required('Required device  Name '),
  deviceNumber: yup.string().required('Required device  Number '),
  manufactural: yup.string().required('Required manufactural '),
  selectedUsers: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

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
const userId = userDetails?.id;


function MyFormDialog({ open, onClose, loadDevices }) {

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };



  const handleFormSubmit = async (values) => {
    try {

      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
      }

      const postData = {
        users: [{ id: userId }],
        deviceName: values.deviceName,
        deviceNumber: values.deviceNumber,
        manufactural: values.manufactural,
        dateTime: values.dateTime.toISOString(),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios.post('http://localhost:8082/api/v1/device/save', postData, config);

      if (response.status === 200) {

        setSnackbar({
          open: true,
          message: "new device is saved successfully",
          severity: 'success',
        });
        loadDevices();
        onClose();

      } else {
        setSnackbar({
          open: true,
          message: "failed to add  new device",
          severity: 'error',
        });
        onClose();
        console.error('Error: Something went wrong with the API request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle> ADD NEW DEVICE </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            onSubmit={handleFormSubmit}
          >
            {({ values, errors, touched, handleBlur, handleChange, setFieldTouched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      variant="filled"
                      type="text"
                      label="device-Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.deviceName}
                      name="deviceName"
                      error={touched.deviceName && !!errors.deviceName}
                      helperText={touched.deviceName && errors.deviceName}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      variant="filled"
                      type="text"
                      label="device-Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.deviceNumber}
                      name="deviceNumber"
                      error={touched.deviceNumber && !!errors.deviceNumber}
                      helperText={touched.deviceNumber && errors.deviceNumber}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      variant="filled"
                      type="text"
                      label="manufactural"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.manufactural}
                      name="manufactural"
                      error={touched.manufactural && !!errors.manufactural}
                      helperText={touched.manufactural && errors.manufactural}
                    />
                  </Grid>



                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={6}>
                      <div style={{ marginTop: '10px' }} />
                      <DateTimePicker
                        value={values.dateTime}
                        onChange={(newValue) =>
                          handleChange({
                            target: { name: 'dateTime', value: newValue },
                          })
                        }
                        disableFuture
                        views={['year', 'month', 'day', 'hours', 'minutes']}
                      />
                    </Grid>
                  </LocalizationProvider>
                </Grid>

                <DialogActions>
                  <Button type="submit" variant="contained" color="secondary">
                    Submit
                  </Button>
                  <Button onClick={onClose} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
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

export default MyFormDialog;




























