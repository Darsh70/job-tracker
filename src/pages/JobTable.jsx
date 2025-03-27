import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { 
  ThemeProvider, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StatusCell from '../components/statusCell';
import { neoBrutalistTheme } from '../components/JobTableStyles';
import DescriptionPopper from '../components/DescriptionPopper';
import { useJobsData } from '../hooks/useJobsData';
import { 
  NeoBrutalistFab, 
  NeoBrutalistDialog, 
  NeoBrutalistDialogTitle, 
  NeoBrutalistDialogButton,
  NeoBrutalistBasicButtonComponent 
} from '../components/NeoBrutalistComponents';


export default function JobTable() {
  const { jobs, loading, updateJobStatus, deleteJobs } = useJobsData();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns = [
    { 
      field: 'title', 
      headerName: 'Job Title', 
      flex: 2, 
      editable: false,
    },
    { 
      field: 'company', 
      headerName: 'Company', 
      flex: 2, 
      editable: false,
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      flex: 2, 
      editable: false,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color="primary" 
          size="small" 
          variant="filled"
        />
      ),
    },
    { 
      field: 'date', 
      headerName: 'Date Applied', 
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.value}
          {params.row.daysSinceApplied !== null && ( // Displays 'days ago'
            <Chip 
              label={`${params.row.daysSinceApplied}D`} 
              color="primary" 
              size="small" 
              sx={{ height: '20px', minWidth: '36px' }}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.5,
      editable: false,
      renderCell: (params) => (
        <StatusCell
          value={params.value}
          id={params.id}
          row={params.row}
          api={params.api}
          updateStatus={updateJobStatus}
        />
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <DescriptionPopper description={params.value} />
      )
    },
    {
      field: 'link',
      headerName: 'Job Link',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <NeoBrutalistBasicButtonComponent 
          href={params.value} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          View Job
        </NeoBrutalistBasicButtonComponent>
      )
    },
  ];

  const handleDeleteConfirmation = () => {
    deleteJobs(selectedRows);
    setIsDeleteModalOpen(false);
    setSelectedRows([]);
  };
  
  return (
    <ThemeProvider theme={neoBrutalistTheme}>
      <Box sx={{ 
        width: '100%', 
        padding: '2px',
        backgroundColor: '#90A8EB',
        position: 'relative',
      }}>
        <DataGrid
           rows={jobs}
           columns={columns}
           initialState={{
             pagination: {
               paginationModel: { pageSize: 100 }
             },
           }}
           pageSizeOptions={[5, 10, 20, 100]}
           loading={loading}
           checkboxSelection
           onRowSelectionModelChange={(newSelectedModel) => setSelectedRows(newSelectedModel)}
           disableRowSelectionOnClick
           autoHeight
           disableColumnMenu
           sx={{
             '& .MuiDataGrid-row': {
               display: 'flex',
               alignItems: 'center',
             },
             '& .MuiDataGrid-cell:focus': {
               outline: 'none',
              },
             '& .MuiDataGrid-cell:focus-within': {
               outline: 'none',
             },
           }}
        />

        {/* Floating Delete Button */}
        {selectedRows.length > 0 && (
          <NeoBrutalistFab 
            aria-label="delete"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <DeleteIcon />
          </NeoBrutalistFab>
        )}

        {/* Confirmation Dialog Popup*/}
        <NeoBrutalistDialog
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <NeoBrutalistDialogTitle>
            Delete Selected Jobs?
          </NeoBrutalistDialogTitle>
          <DialogContent>
            <DialogContentText sx={{ 
              textAlign: 'center', 
              color: 'black',
              fontWeight: 'bold',
              marginBottom: '16px' 
            }}>
              Are you sure you want to delete {selectedRows.length} selected job(s)? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center', 
            gap: 2,
            marginBottom: '16px' 
          }}>
            <NeoBrutalistDialogButton 
              onClick={() => setIsDeleteModalOpen(false)}
              color="primary"
            >
              Cancel
            </NeoBrutalistDialogButton>
            <NeoBrutalistDialogButton
              onClick={handleDeleteConfirmation} 
              color="error"
            >
              Delete
            </NeoBrutalistDialogButton>
          </DialogActions>
        </NeoBrutalistDialog>
      </Box>
    </ThemeProvider>
  );
}