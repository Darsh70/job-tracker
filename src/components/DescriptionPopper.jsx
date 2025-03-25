import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { Popper, Paper, ClickAwayListener } from '@mui/material';
import NeoBrutalistButton from './JobLinkButton';

// Internal Popper Component 
const PopperContent = ({ description, open, anchorEl, handleClose }) => {
  const sanitizedDescription = DOMPurify.sanitize(description || ''); // Prevent null errors

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="left-start"
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [10, 10], // Slightly adjusted for better spacing
          },
        },
      ]}
      style={{ zIndex: 1300 }}
    >
      <ClickAwayListener onClickAway={handleClose}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            maxWidth: '500px', 
            maxHeight: '400px', 
            overflow: 'auto',
            border: '2px solid #000',
            boxShadow: '4px 4px 0px #000',
          }}
        > 
          <div style={{ paddingLeft: '8px' }} dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />  
        </Paper> 
      </ClickAwayListener>
    </Popper>
  ); 
};

// Main Component
const DescriptionPopper = ({ description }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <NeoBrutalistButton onClick={handleClick}>
        {open ? 'Close' : 'Description'}
      </NeoBrutalistButton>
      <PopperContent 
        description={description} 
        open={open} 
        anchorEl={anchorEl} 
        handleClose={handleClose} 
      />
    </>
  );
};

export default DescriptionPopper;
