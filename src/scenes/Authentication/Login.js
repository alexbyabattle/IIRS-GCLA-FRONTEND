import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Box,
  Avatar,
  Typography,
  Snackbar,
  Alert,
  Link,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import image from '../../data/image';
import { Link as RouterLink } from 'react-router-dom';

const initialValues = {
  email: '',
  password: '',
};

const checkoutSchema = yup.object().shape({
  email: yup.string().required('Required email'),
  password: yup.string().required('Required password'),
});

const Login = () => {

  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFormSubmit = async (values) => {
    try {
      const formattedData = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post('http://localhost:8082/api/v1/auth/authenticate', formattedData);


      if (response.status === 200) {

        setSnackbar({
          open: true,
          message: "user logged in  successfully",
          severity: 'success',
        });
        const { access_token, refresh_token } = response.data;

        localStorage.clear();
        // Store the token in local storage
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        // Redirect to another page after successful login
        navigate('/dashboard');

      } else {
        setSnackbar({
          open: true,
          message: "failed to login  invalid credentials",
          severity: 'error',
        });


      }
    } catch (error) {
      // Reset form values
      formik.resetForm();

    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: handleFormSubmit,
  });

  // Get base URL
  const baseUrl = window.location.origin;

  return (
    <Box
      bgcolor="#0D1825"
      p={4}
      borderRadius={5}
      mt={8}
      mx="auto"
      maxWidth={500}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      boxShadow={3}
    >
      <Typography component="h5" variant="h5" mb={1} color="white">
        GOVERNMENT CHEMITRY  LABORATORY  AUTHORITY
      </Typography>

      <Avatar sx={{ m: 2, bgcolor: 'secondary.main', width: 100, height: 100 }}>
        <img
          alt="gcla admin"
          width="100%"
          height="100%"
          src={image.gcla}
          style={{ cursor: 'pointer', borderRadius: '50%' }}
        />
      </Avatar>

      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <Box mb={2} display="flex" justifyContent="center">
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              name="email"
              error={!!formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="filled"
              type="password"
              label="Password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              name="password"
              error={!!formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="center">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Submit
          </Button>
        </Box>
      </form>

      {/* Link to Register Page */}
      <Box mt={2} display="flex" justifyContent="center">
        <Typography variant="body1">
          Don't have an account?{' '}
          <Link to={`${baseUrl}/register`} component={RouterLink} style={{ color: 'blue', textDecoration: 'underline' }}>
            Click here to register
          </Link>
        </Typography>

      </Box>

      {/* Link to go back to HomePage */}
      <Box mt={2} display="flex" justifyContent="center">
        <Typography variant="body1">
          Go  back to {' '}
          <Link to={`${baseUrl}/`} component={RouterLink} style={{ color: 'blue', textDecoration: 'underline' }}>
            Homepage
          </Link>
        </Typography>

      </Box>
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

    </Box>
  );
};

export default Login;
