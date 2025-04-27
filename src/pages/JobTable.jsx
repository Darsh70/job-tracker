import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { 
  ThemeProvider, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Chip,
  Tooltip
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
} 
from '../components/NeoBrutalistComponents';
import SearchBar from '../components/SearchBar';

export default function JobTable() {
  const { jobs, loading, updateJobStatus, deleteJobs } = useJobsData();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredJobs, setFilteredJobs] = useState([]); 

  useEffect(() => {
    const originalJobs = jobs || [];

    if (!searchTerm) {
      setFilteredJobs(originalJobs);
      return;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = originalJobs.filter(job => {
      const titleMatch = job.title?.toLowerCase().includes(lowerCaseSearchTerm);
      const companyMatch = job.company?.toLowerCase().includes(lowerCaseSearchTerm);
      const locationMatch = job.location?.toLowerCase().includes(lowerCaseSearchTerm);
      const statusMatch = job.status?.toLowerCase().includes(lowerCaseSearchTerm);
      return titleMatch || companyMatch || locationMatch || statusMatch ;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

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
      sortingOrder: ['asc', 'desc'],
      sortComparator: (v1, v2, param1, param2) => {
        // First compare by date
        const date1 = new Date(v1);
        const date2 = new Date(v2);
        
        if (date1.getTime() !== date2.getTime()) {
          return date1.getTime() - date2.getTime(); 
        }
        
        // If dates are equal, compare by ID
        return param1.id - param2.id;
      },
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.value}
          {params.row.daysSinceApplied !== null && ( // Displays 'days ago'
          <Tooltip title = "DAYS AGO" placement='right' sx={{ '& .MuiTooltip-tooltip': { backgroundColor: '#000' } }}>
            <Chip 
              label={`${params.row.daysSinceApplied}`} 
              color="primary" 
              size="small" 
              sx={{ height: '20px', minWidth: '36px' }}
            />
            </Tooltip>
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
        </NeoBrutalistBasicButtonComponent >
      )
    },
  ];

  const handleDeleteConfirmation = () => {
    deleteJobs(selectedRows);
    setIsDeleteModalOpen(false);
    setSelectedRows([]);
  };

  const displayJobs = filteredJobs || [];
  const isLoading = loading && !jobs;
  
  return (
    <ThemeProvider theme={neoBrutalistTheme}>
      <Box sx={{ 
        width: '100%', 
        padding: '2px',
        backgroundColor: '#90A8EB',
        position: 'relative',
      }}>
        {/* Search Bar */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '32px',
          marginTop: '16px',
        }}>
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
        </Box>
        <DataGrid
           rows={displayJobs}
           columns={columns}
           initialState={{
             pagination: {
               paginationModel: { pageSize: 100 }
             },
             sorting: {
              sortModel: [{ field: 'date', sort: 'asc' }]
            }
           }}
           pageSizeOptions={[50, 100]}
           loading={isLoading}
           checkboxSelection
           onRowSelectionModelChange={(newSelectedModel) => setSelectedRows(newSelectedModel)}
           rowSelectionModel={selectedRows}
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
              color="cancel"
            >
              Cancel
            </NeoBrutalistDialogButton>
            <NeoBrutalistDialogButton
              onClick={handleDeleteConfirmation} 
              color="delete"
            >
              Delete
            </NeoBrutalistDialogButton>
          </DialogActions>
        </NeoBrutalistDialog>
      </Box>
    </ThemeProvider>
  );
}