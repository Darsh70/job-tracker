import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { Popper, Paper, ClickAwayListener } from '@mui/material';
import { NeoBrutalistBasicButtonComponent } from './NeoBrutalistComponents';

// Add description in popper
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
            offset: [10, 10], 
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
          <div style={{ paddingLeft: '8px' }} dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />  {/*Render HTML tags*/}
        </Paper> 
      </ClickAwayListener>
    </Popper>
  ); 
};



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
      <NeoBrutalistBasicButtonComponent  onClick={handleClick}>
        {open ? 'Close' : 'Description'}
      </NeoBrutalistBasicButtonComponent>
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
