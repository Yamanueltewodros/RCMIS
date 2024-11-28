// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Snackbar from '@mui/material/Snackbar';
// import Fade from '@mui/material/Fade';
// import Slide from '@mui/material/Slide';

// function SlideTransition(props) {
//   return <Slide {...props} direction="up" />;
// }


// export default function TransitionsSnackbar() {
//   const [state, setState] = React.useState({
//     open: false,
//     Transition: Fade,
//   });

//   const handleClick = (Transition) => () => {
//     setState({
//       open: true,
//       Transition,
//     });
//   };

//   const handleClose = () => {
//     setState({
//       ...state,
//       open: false,
//     });
//   };

//   return (
//     <div>

//       {/* <Button onClick={handleClick(SlideTransition)}>Slide Transition</Button> */}
//       <Snackbar
//         open={state.open}
//         onClose={handleClose}
//         TransitionComponent={state.Transition}
//         message={'this is snackbar'}
//         key={state.Transition.name}
//         autoHideDuration={1200}
//       />
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import './SnackbarComponent.css'; // Import the associated CSS

const SnackbarComponent = ({ message, severity, autoHideDuration = 3000, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Automatically close the Snackbar after the specified duration
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        setOpen(false);
        if (onClose) {
          onClose();
        }
      }, autoHideDuration);

      // Cleanup timer if the component unmounts or closes early
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onClose]);

  if (!open) return null; // Don't render if Snackbar is closed

  return (
    <div className={`snackbar snackbar-${severity}`}>
      <p>{message}</p>
      <button className="close-btn" onClick={() => { setOpen(false); onClose && onClose(); }}>
        &times;
      </button>
    </div>
  );
};

export default SnackbarComponent;

