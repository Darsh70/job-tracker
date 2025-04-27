import React from 'react';
import { colors, styled } from '@mui/material';
import Box from '@mui/material/Box';
import { 
  Dialog, 
  DialogTitle, 
  Button
} from '@mui/material';



export const NeoBrutalistFab = ({ children, onClick, ...props }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        cursor: 'pointer',
        backgroundColor: '#FF6B6B', 
        color: 'white',
        width: 56,
        height: 56,
        borderRadius: '8px', 
        boxShadow: '4px 4px 0px #000',
        border: '2px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.1s, box-shadow 0.1s',
        '&:hover': {
          transform: 'translate(2px, 2px)',
          boxShadow: '2px 2px 0px #000',
        },
        '&:active': {
          transform: 'translate(4px, 4px)',
          boxShadow: '0px 0px 0px #000',
        }
      }}
      {...props}
    >
      {children}
    </Box>
  );
};


export const NeoBrutalistDialog = ({ children, ...props }) => {
  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: '12px',
          border: '3px solid black',
          boxShadow: '8px 8px 0px #000',
          backgroundColor: '#F0F0F0',
          padding: '0px',
        }
      }}
      {...props}
    >
      {children}
    </Dialog>
  );
};


export const NeoBrutalistDialogTitle = ({ children, ...props }) => {
  return (
    <DialogTitle
      sx={{
        fontWeight: 'bold',
        borderBottom: '2px solid black',
        marginBottom: '16px',
        padding: '8px',
        textAlign: 'center',
        backgroundColor: '#90A8EB',
        color: 'black',
      }}
      {...props}
    >
      {children}
    </DialogTitle>
  );
};


export const NeoBrutalistDialogButton = ({ children, color, ...props }) => {
  const buttonColors = {
    delete: {
      bg: '#FF6B6B',
      border: '#000',
    },
    cancel: {
      bg: '#289D8F',
      border: '#000',
    }
  };

  const colorScheme = buttonColors[color] || buttonColors.cancel;

  return (
    <Button
      sx={{
        backgroundColor: colorScheme.bg,
        color: 'white',
        border: `2px solid ${colorScheme.border}`,
        boxShadow: '4px 4px 0px #000',
        fontWeight: 'bold',
        transition: 'transform 0.1s, box-shadow 0.1s',
        '&:hover': {
          backgroundColor: colorScheme.bg,
          transform: 'translate(2px, 2px)',
          boxShadow: '2px 2px 0px #000',
        },
        '&:active': {
          transform: 'translate(4px, 4px)',
          boxShadow: '0px 0px 0px #000',
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

const NeoBrutalistBasicButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    borderRadius: '0.4em',
    background: '#000000',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '11px',
    padding: '0.3em 0.6em 0.5em',
    textTransform: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: '#F8F5F1',
      border: '2px solid #000000',
      borderBottom: '2px solid #000000',
      borderRadius: '0.4em',
      transform: 'translateY(-0.2em)',
      transition: 'transform 0.1s ease, border-bottom 0.1s ease',
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
  
  export const NeoBrutalistBasicButtonComponent = (props) => {
    return (
      <NeoBrutalistBasicButton {...props}>
        <span className="MuiButton-label">{props.children}</span>
      </NeoBrutalistBasicButton>
    );
  };


  export const ChartHeader = ({ text, backgroundColor = '#90A8EB' }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontWeight: 'bold',
            borderBottom: '2px solid #000',
            padding: '4px',
            fontSize: '18px',
            letterSpacing: '2px',
            backgroundColor: backgroundColor,
          }}
        >
          {text}
        </h2>
      </Box>
    );
  };
  
 