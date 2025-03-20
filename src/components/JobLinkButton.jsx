import { Button, styled } from '@mui/material';
import React from 'react';

const NeoBrutalistButton = styled(Button)(({ theme }) => ({
  /* Base button styles */
  position: 'relative',
  borderRadius: '0.4em', // Further reduced border radius
  background: '#000000',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '11px', // Smaller font size
  padding: '0.3em 0.6em', // Reduced padding
  boxShadow: 'none',
  textTransform: 'none',
  '&:hover': {
    background: '#000000',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: '#ffffff',
    border: '2px solid #000000',
    borderBottom: '4px solid #000000', // Stronger bottom border on hover
    borderRadius: '0.4em', // Reduced border radius
    transform: 'translateY(-0.2em)',
    transition: 'transform 0.1s ease, border-bottom 0.1s ease', // Smooth transition for border
    zIndex: 1,
  },
  '& .MuiButton-label': {
    position: 'relative',
    zIndex: 2,
    padding: '0.3em 0.8em', 
    color: '#000000',
    transition: 'transform 0.1s ease', 
  },
  '&:hover::before': {
    transform: 'translateY(-0.33em)',
  },
  '&:active::before': {
    transform: 'translateY(0)',
  },
  '&:hover .MuiButton-label': {
    transform: 'translateY(-0.1em)', 
  },
  '&:active .MuiButton-label': {
    transform: 'translateY(0.2em)'
  }
}));

const NeoBrutalistButtonComponent = (props) => {
  return (
    <NeoBrutalistButton {...props}>
      <span className="MuiButton-label">{props.children}</span>
    </NeoBrutalistButton>
  );
};

export default NeoBrutalistButtonComponent;
