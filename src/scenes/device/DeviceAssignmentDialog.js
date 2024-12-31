import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';

const initialValues = {
  selectedUsers: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  selectedUsers: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

function MyFormDialog({ open, onClose, loadDeviceDetails, selectedDevices }) {
  const [selectTouched, setSelectTouched] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeviceAssignment = async (values) => {
    try {
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

      const postData = {
        userIds: selectedUsers.map((user) => user.id), // Extracting IDs from selected users
        deviceIds: selectedDevices,
      };

      console.log('Data to be sent:', postData);

      const response = await axios.post('http://localhost:8082/api/v1/device/assignment', postData, config);


      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "device has been assigned to user successfully",
          severity: 'success',
        });
        loadDeviceDetails();
        onClose();
        setSelectTouched(false);
      } else {
        setSnackbar({
          open: true,
          message: "failed to assign device to a user",
          severity: 'errror',
        });
        console.error('Error: Something went wrong with the API request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
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

        const response = await axios.get('http://localhost:8082/api/v1/users/all', config);

        if (response.data && response.data.data) {
          // Filter users whose department is not "IT"
          const filteredUsers = response.data.data.filter((user) => user.department !== 'IT');

          // Map filtered users to format suitable for select field
          const formattedUsers = filteredUsers.map((user) => ({
            id: user.id,
            name: user.name,
          }));
          setUsers(formattedUsers);
        } else {

          console.error('Invalid response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);


  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ASSIGN INCIDENT TO PARTICULAR ADMIN</DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleDeviceAssignment}>
          {({ values, errors, touched, handleBlur, handleChange, setFieldTouched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={users}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setSelectedUsers(newValue);
                      setSelectTouched(true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="USER ASSIGNED INCIDENT"
                        variant="filled"
                        onBlur={() => {
                          setSelectTouched(true); // Mark select as touched
                        }}
                        helperText={
                          selectTouched && selectedUsers.length === 0 && 'At least one user must be selected'
                        }
                      />
                    )}
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
