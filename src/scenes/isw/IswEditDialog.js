import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';

const checkoutSchema = yup.object().shape({
  iswName: yup.string().required('Required incident solving way'),
  incidentCausedBy : yup.string().required('required incident caused by'),
  incidentStatus : yup.string().required('required  incident status'),
  deviceToReplace : yup.string().required('required  device  to  replace'),
  dateTime: yup.date().required('Date and time is required'),
});

const IswEditDialog = ({ id, open, onClose , loadIsws }) => {
  const [selectTouched, setSelectTouched] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [editedData, setEditedData] = useState({});


  const fetchIswData = async (id) => {
    
    try {
      const response = await axios.get(`http://localhost:8082/api/isw/getIswWithIncidents/${id}`);
      const iswData = response.data.data;
      setEditedData(iswData);
      setSelectedIncidents(iswData.incidents.map((incident) => incident.id));
    } catch (error) {
      console.error('Error fetching isw data:', error);
      console.error('Response Data:', error.response?.data);
    }
  };


  useEffect(() => {
    if (id) {
    fetchIswData(id);
    }
  }, [id]);

  

  
  const handleSave = async (values) => {
    try {
      const response = await axios.put(`http://localhost:8082/api/isw/editing/${id}`, values);
      const updatedData = response.data;
      setEditedData(updatedData);
      loadIsws();
      onClose();
    } catch (error) {
      console.error('Error updating isw data:', error);
      console.error('Response Data:', error.response?.data);
    }
  };  

  {/* const handleSave = async (values) => {
    try {
      // Exclude 'id' property if it's null
      const requestData = values.id ? values : { iswName: values.iswName, incidents: values.incidents };
  
      const response = await axios.put(`http://localhost:8082/api/isw/${id}`, requestData);
      const updatedData = response.data;
      setEditedData(updatedData);
      onClose();
    } catch (error) {
      console.error('Error updating isw data:', error);
    }
  };  */}
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>EDIT INCIDENT SOLVING WAYS</DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={{
            iswName: editedData.iswName || '',
            incidentCausedBy: editedData.incidentCausedBy ||  '',
            deviceToReplace : editedData.deviceToReplace ||  '' , 
            incidentStatus : editedData.incidentStatus || '' ,
            dateTime: dayjs(),
          }}
          onSubmit={(values) => handleSave(values)}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Solving Way"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.iswName}
                    name="iswName"
                    error={touched.iswName && !!errors.iswName}
                    helperText={touched.iswName && errors.iswName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="incidentCausedBy"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.incidentCausedBy}
                    name="incidentCausedBy"
                    error={touched.incidentCausedBy && !!errors.incidentCausedBy}
                    helperText={touched.incidentCausedBy && errors.incidentCausedBy}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="deviceToReplace"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.deviceToReplace}
                    name="deviceToReplace"
                    error={touched.deviceToReplace && !!errors.deviceToReplace}
                    helperText={touched.deviceToReplace && errors.deviceToReplace}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="incident Status"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.incidentStatus}
                    name="incidentStatus"
                    error={touched.incidentStatus && !!errors.incidentStatus}
                    helperText={touched.incidentStatus && errors.incidentStatus}
                  />
                </Grid>

                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={6}>
                    <div style={{ marginTop: '10px' }} />
                    <DateTimePicker
                      value={values.dateTime}
                      onChange={(newValue) => handleChange('dateTime')(newValue)}
                      disableFuture
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                      name="dateTime"
                      error={touched.dateTime && !!errors.dateTime}
                      helperText={touched.dateTime && errors.dateTime}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
                <Button type="submit" color="secondary" variant="contained">
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

export default IswEditDialog;
     