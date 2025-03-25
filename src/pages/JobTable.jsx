import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import StatusCell from '../components/statusCell';
import { Chip, ThemeProvider } from '@mui/material';
import { neoBrutalistTheme} from '../components/JobTableStyles';
import NeoBrutalistButton from '../components/JobLinkButton';
import DescriptionPopper from '../components/DescriptionPopper';

function useJobsData() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const calculateDaysSince = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const fetchJobs = () => {
    fetch('http://localhost:5001/getJobs')
      .then(response => response.json())
      .then(data => {
        const jobsWithId = data.map((job, index) => ({
          id: index,
          ...job,
          daysSinceApplied: job.date ? calculateDaysSince(job.date) : null
        }));
        setJobs(jobsWithId);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  };
  
  const updateJobStatus = (jobId, job, newStatus) => {
    setJobs(prevJobs =>
      prevJobs.map(j =>
        j.id === jobId ? { ...j, status: newStatus } : j
      )
    );
    fetch('http://localhost:5001/updateStatus', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        status: newStatus,
        url: job.link
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update job status');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error updating job status:', error);
        fetchJobs();
      });
  };
  
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return { jobs, loading, updateJobStatus };
}

export default function JobTable() {
  const { jobs, loading, updateJobStatus } = useJobsData();
  
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
          {params.row.daysSinceApplied !== null && (
            <Chip 
              label={`${params.row.daysSinceApplied}D`} 
              color="secondary" 
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
        <NeoBrutalistButton 
          href={params.value} 
          target="_blank" 
          rel="noopener noreferrer"
          
        >
          View Job
        </NeoBrutalistButton>
      )
    },
  ];
  
  return (
    <ThemeProvider theme={neoBrutalistTheme}>
      <Box sx={{ 
        width: '100%', 
        padding: '2px',
        backgroundColor: '#90A8EB',
        
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
      </Box>
    </ThemeProvider>
  );
}