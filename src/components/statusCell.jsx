import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';

const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

// Change background color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'Rejected': return '#FFCDD2';  // red
    case 'Offer': return '#C8E6C9';     // green
    case 'Interviewing': return '#FFF9C4'; // yellow
    default: return '#F8F5F1';          // beige
  }
};

export default function StatusCell({ value, id, row, api, updateStatus }) {
  const [status, setStatus] = useState(value || "Applied");
  
  const handleChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    api.setEditCellValue({ id, field: 'status', value: newStatus }, event);
    updateStatus(id, row, newStatus);
  };

  return (
    <Select
      value={status}
      onChange={handleChange}
      size="small"
      sx={{
        width: '100%',
        height: 35,
        backgroundColor: getStatusColor(status), 
        borderTop: '1px solid #000000',
        borderLeft: '1px solid #000000',
        borderBottom: '4px solid #000000',
        borderRight: '4px solid #000000',
        borderRadius: '5px',
        paddingLeft: '10px',
        transition: 'background-color 0.3s ease-in-out',
      }}
      input={<InputBase sx={{ padding: '0 8px' }} />} // Remove default border
      MenuProps={{
        PaperProps: {
          sx: {
            border: '2px solid #000000', 
            backgroundColor: '#F8F5F1'
          },
        },
      }}
    >
      {statusOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}
