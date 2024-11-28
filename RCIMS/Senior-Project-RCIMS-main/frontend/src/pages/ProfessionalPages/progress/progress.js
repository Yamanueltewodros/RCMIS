import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import AddProgress from './AddProgress'; // Import the AddProgress component
import ViewProgress from './viewprogress'; // Import the ViewProgress component
import Visualize from './Visualize'; // Import the Visualize component
//import "./progress.css";

const Progress = ({ patientId }) => {
  const [activeSection, setActiveSection] = useState('view'); // Default to "view progress"
  const navigate = useNavigate(); // Initialize the navigate function

  // Handlers to switch sections
  const handleAddProgress = () => {
    setActiveSection('add'); // Switch to "Add Progress"
  };

  const handleViewProgress = () => {
    setActiveSection('viewProgress'); // Switch to "View Progress"
  };

  const handleVisualizeProgress = () => {
    setActiveSection('visualize'); // Switch to "Visualize Progress"
  };

  // Back button handler
  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page in the browser history
  };

  // Conditionally render the section based on what button is clicked
  return (
    <div style={pageStyle}>
      <h1>Patient Progress Management</h1>

      {/* Back Button */}
      <button style={backButtonStyle} onClick={handleGoBack}>
        Back
      </button>

      {/* Conditionally show buttons only if no specific section is active */}
      {activeSection === 'view' && (
        <div style={buttonContainerStyle}>
          {/* Button to Add Progress */}
          <button style={buttonStyle} onClick={handleAddProgress}>
            Add Progress
          </button>

          {/* Button to View Progress */}
          <button style={buttonStyle} onClick={handleViewProgress}>
            View Progress
          </button>

          {/* Button to Visualize Progress */}
          <button style={buttonStyle} onClick={handleVisualizeProgress}>
            Visualize
          </button>
        </div>
      )}

      {/* Render the appropriate section based on the active state */}
      <div style={sectionContainerStyle}>
        {activeSection === 'add' && <AddProgress patientId={patientId} />} {/* Render AddProgress */}
        {activeSection === 'viewProgress' && <ViewProgress patientId={patientId} />} {/* Render ViewProgress */}
        {activeSection === 'visualize' && <Visualize patientId={patientId} />} {/* Render Visualize */}
      </div>
    </div>
  );
};

// Styles
const pageStyle = {
  textAlign: 'center',
  margin: '20px',
};

const backButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#666',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  position: 'absolute', // Position it relative to the top left
  top: '20px',
  left: '20px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  flexWrap: 'wrap',
  marginTop: '20px',
};

const buttonStyle = {
  padding: '15px 25px',
  backgroundColor: '#003366',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const sectionContainerStyle = {
  marginTop: '20px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
  textAlign: 'left',
  width: '60%',
  margin: '0 auto',
};

export default Progress;
