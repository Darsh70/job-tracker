import { createTheme } from '@mui/material';

export const neoBrutalistTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',  
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '3px solid #000',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#000000',
            borderBottom: '3px solid #000',
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'uppercase',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #000',
            padding: '16px 8px',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#F4A261', 
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '3px solid #000',
            backgroundColor: '#90A8EB',
          },
          '& .MuiTablePagination-root': {
            color: '#000',
          },
          '& .MuiCheckbox-root': {
            color: '#000',
            '&.Mui-checked': {
              color: '#000',
            }
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#F8F5F1',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          border: '2px solid #000',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
        },
        colorPrimary: {
          backgroundColor: '#2A9D8F', // Location chip background
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#264653',
          },
        },
      },
    },
  },
});


