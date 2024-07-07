import React, { useState, useEffect } from 'react';
import { Box, IconButton, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import axios from 'axios';
import DeleteDialog from './DeleteIswDialog';
import IswDetailsDialog from './IswDetailsDialog';
import IswEditDialog from './IswEditDialog';

const IswTable = () => {
  const [rows, setRows] = useState([]);

  const loadIsws = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/isw/list');
      const { data } = response.data;

      const formattedData = data.map((item) => ({
        id: item.id,
        iswName: item.iswName,
        incidentCausedBy: item.incidentCausedBy,
        incidentTitle: item.incidents.map((incident) => incident.incidentTitle).join(', '),
        incidentType: item.incidents.map((incident) => incident.incidentType).join(', '),
        deviceName: item.incidents.map((incident) =>
          incident.devices.map((device) => device.deviceName).join(',')
        ),
        deviceNumber: item.incidents.map((incident) =>
          incident.devices.map((device) => device.deviceNumber).join(',')
        ),
        manufactural: item.incidents.map((incident) =>
          incident.devices.map((device) => device.manufactural).join(',')
        ),
        status: item.incidents.map((incident) =>
          incident.devices.map((device) => device.status).join(',')
        ),
      }));

      setRows(formattedData);

      if (response.data.header.responseCode === 0) {
        showSnackbar(0, response.data.header.responseStatus);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(1, 'Error Message'); // Example usage of showSnackbar with responseCode 1
    }
  };

  useEffect(() => {
    loadIsws();
  }, []);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode === 0 ? 'green' : 'red'); // Adjust color based on responseCode
    setSnackbarOpen(true);
  };

  const [selectedIswId, setSelectedIswId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (iswId) => {
    setSelectedIswId(iswId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedIswId(null);
    loadIsws();
  };

  const [iswDetailsDialogOpen, setIswDetailsDialogOpen] = useState(false);
  const [selectedIswIdForDetails, setSelectedIswIdForDetails] = useState(null);

  const openIswDetailsDialog = (iswId) => {
    setSelectedIswIdForDetails(iswId);
    setIswDetailsDialogOpen(true);
  };

  const closeIswDetailsDialog = () => {
    setSelectedIswIdForDetails(null);
    setIswDetailsDialogOpen(false);
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIswIdForEdit, setSelectedIswIdForEdit] = useState(null);

  const handleEditClick = (iswId) => {
    setSelectedIswIdForEdit(iswId);
    setIsEditDialogOpen(true);
  };

  const closeIswEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedIswIdForEdit(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'incidentTitle',
      headerName: 'Incident Title',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'incidentType',
      headerName: 'Incident Type',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'iswName',
      headerName: 'Incident Solving Way',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'incidentCausedBy',
      headerName: 'Incident Cause',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'deviceName',
      headerName: 'Device Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'deviceNumber',
      headerName: 'Device Number',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ row }) => {
        let statusColor;
        let textColor;

        if (row.status.includes("FINE")) {
          statusColor = "#4CAF50"; // Green for FINE status
          textColor = "#FFFFFF"; // White text for FINE status
        } else if (["ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].some(status => row.status.includes(status))) {
          statusColor = "#4CAF50"; // Green for other success statuses
          textColor = "#FFFFFF"; // White text for success statuses
        } else if (["PENDING", "FAULT", "SOLUTION_PENDING", "IN_ACTIVE"].some(status => row.status.includes(status))) {
          statusColor = "#f44336"; // Red for error statuses
          textColor = "#FFFFFF"; // White text for error statuses
        } else {
          statusColor = "#FFFFFF"; // Default background color
          textColor = "#000000"; // Default text color
        }

        return (
          <Box
            bgcolor={statusColor}
            color={textColor}
            p={1}
            borderRadius={5}
          >
            {row.status}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton color="secondary" onClick={() => handleDeleteClick(row.id)}>
              <Delete style={{ color: 'red' }} />
            </IconButton>
            <IconButton color="info" onClick={() => handleEditClick(row.id)}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton color="success" onClick={() => openIswDetailsDialog(row.id)}>
              <VisibilityOutlinedIcon style={{ color: 'green' }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="INCIDENT SOLVING WAY" />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        iswId={selectedIswId}
        loadIsws={loadIsws}
        showSnackbar={showSnackbar}
      />
      <IswDetailsDialog
        id={selectedIswIdForDetails}
        open={iswDetailsDialogOpen}
        onClose={closeIswDetailsDialog}
      />
      <IswEditDialog
        id={selectedIswIdForEdit}
        open={isEditDialogOpen}
        onClose={closeIswEditDialog}
        loadIsws={loadIsws}
      />
      <Box m="40px 0 0 0" height="72vh">
        <DataGrid rows={rows} columns={columns} />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ backgroundColor: snackbarColor }}
      />
    </Box>
  );
};

export default IswTable;