import React, { useState } from 'react';
import '../../Styling/AdminPageStyles/Appointments.css';

// Import the three components for View, Edit, and Add Appointments
import ViewAppointments from './ViewAppointments';
import EditAppointments from './EditAppointments';
import AddAppointments from './AddAppointments';

function Appointments() {
  // State to keep track of which page to display
  const [activePage, setActivePage] = useState('ViewAppointments');

  // Function to render the correct component based on the active page
  const renderPage = () => {
    switch (activePage) {
      case 'ViewAppointments':
        return <ViewAppointments />;
      case 'EditAppointments':
        return <EditAppointments />;
      case 'AddAppointments':
        return <AddAppointments />;
      default:
        return <ViewAppointments />;
    }
  };

  return (
    <div className="appointments-page">
      {/* Tabs for navigating between different appointment pages */}
      <div className="tabs">
        <button
          className={`tab-button ${activePage === 'ViewAppointments' ? 'active' : ''}`}
          onClick={() => setActivePage('ViewAppointments')}
        >
          View Appointments
        </button>
        <button
          className={`tab-button ${activePage === 'EditAppointments' ? 'active' : ''}`}
          onClick={() => setActivePage('EditAppointments')}
        >
          Edit Appointments
        </button>
        <button
          className={`tab-button ${activePage === 'AddAppointments' ? 'active' : ''}`}
          onClick={() => setActivePage('AddAppointments')}
        >
          Add Appointments
        </button>
      </div>

      {/* Render the page content below the tabs */}
      <div className="tab-content">
        {renderPage()}
      </div>
    </div>
  );
}

export default Appointments;
