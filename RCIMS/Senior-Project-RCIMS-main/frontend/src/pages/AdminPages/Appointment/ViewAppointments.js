import React from 'react';
import '../../Styling/AdminPageStyles/ViewAppointments.css';

function ViewAppointments() {
  return (
    <div className="view-appointments-container">
      {/* Today's Appointments Section */}
      <div className="appointments-list">
        <h2>Today Appointment</h2>
        <div className="appointment-item ongoing">
          <div className="appointment-details">
            <span className="patient-name">M.J. Mical</span>
            <span className="appointment-type">Health Checkup</span>
          </div>
          <span className="status ongoing">On Going</span>
          <span className="appointment-time">12:30 PM</span>
        </div>
        <div className="appointment-item ongoing">
          <div className="appointment-details">
            <span className="patient-name">Sanath Deo</span>
            <span className="appointment-type">Health Checkup</span>
          </div>
          <span className="status ongoing">On Going</span>
          <span className="appointment-time">01:00 PM</span>
        </div>
        <div className="appointment-item pending">
          <div className="appointment-details">
            <span className="patient-name">Komola Haris</span>
            <span className="appointment-type">Common Cold</span>
          </div>
          <span className="status pending">Pending</span>
          <span className="appointment-time">01:30 PM</span>
        </div>
        <div className="see-all-link">
          <a href="#">See All</a>
        </div>
      </div>

      {/* Next Patient Details Section */}
      <div className="next-patient-details">
        <h2>Next Patient Details</h2>
        <div className="patient-info">
          <span className="patient-name">Sanath Deo</span>
          <span className="patient-details">Health Checkup</span>
          <div className="patient-meta">
            <span>D.O.B: 15 Jan 1989</span>
            <span>Sex: Male</span>
            <span>Weight: 59 kg</span>
            <span>Height: 172 cm</span>
            <span>Last Appointment: 15 Dec 2021</span>
            <span>Patient ID: 022009220005</span>
          </div>
          <div className="patient-history">
            <h3>Patient History</h3>
            <span className="history-tag">Asthma</span>
            <span className="history-tag">Hypertension</span>
            <span className="history-tag">Fever</span>
          </div>
          
        </div>
      </div>

      {/* Calendar Section */}
      <div className="calendar">
        <h2>Calendar</h2>
        <div className="calendar-placeholder">[Calendar Placeholder]</div>
      </div>
    </div>
  );
}

export default ViewAppointments;
