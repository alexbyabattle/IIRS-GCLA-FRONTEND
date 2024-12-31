import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
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

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
  location: yup.string().required('Location is required'),
  department: yup.string().required('Department is required'),
});

const EditDialogForUser = ({ open, onClose, loadImages }) => {
  const [file, setFile] = useState(null);

  const getUserDetailsFromToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        return decodedToken; // Contains `id`, `role`, `department`
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  };

  const userDetails = getUserDetailsFromToken();
  const userId = userDetails?.id;

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(
        `http://localhost:8082/api/v1/users/get/${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleSave = async (values) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('location', values.location);
      formData.append('department', values.department);
      if (file) {
        formData.append('file', file);
      }

      await axios.put(
        `http://localhost:8082/api/v1/users/${userId}/update`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      onClose();
      loadImages(); // Refresh the data
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserData().then((data) => {
        if (data) {
          setInitialValues({
            name: data.name || '',
            phoneNumber: data.phoneNumber || '',
            location: data.location || '',
            department: data.department || '',
            createdAt: data.createdAt ? dayjs(data.createdAt) : dayjs(),
          });
        }
      });
    }
  }, [open]);

  const [initialValues, setInitialValues] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    department: '',
    createdAt: dayjs(),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit User Details</DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Phone Number"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Location"
                    name="location"
                    value={values.location}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Department"
                    name="department"
                    value={values.department}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.department && Boolean(errors.department)}
                    helperText={touched.department && errors.department}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Created At"
                      value={values.createdAt}
                      onChange={(newValue) =>
                        setFieldValue('createdAt', newValue)
                      }
                      disableFuture
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ marginTop: '10px' }}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
                <Button type="submit" color="secondary" variant="contained">
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogForUser;
