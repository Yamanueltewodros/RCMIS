import React, { useState , useEffect} from 'react';
import axios from 'axios';
import '../PatientPagesStyles/AddAppointments.css';

// Names and classes should be modified
function AddPatient({selectedAppointment}) {
    const [formData, setFormData] = useState({
        patientName: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
      });
    
      useEffect(() => {
        if (selectedAppointment) {
          setFormData({
            patientName: selectedAppointment.patientName,
            appointmentDate: selectedAppointment.appointmentDate,
            appointmentTime: selectedAppointment.appointmentTime,
            notes: selectedAppointment.notes,
          });
        }
      }, [selectedAppointment]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Update the appointment logic here
        console.log('Updated appointment data:', formData);
      };

    return (
        <div>
            <h2>Schedule An Appointment</h2>
            <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientName">Professional's Name *</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="appointmentDate">Appointment Date *</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="appointmentTime">Appointment Time *</label>
          <input
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
        </div>

        {/*Other appointment Details can be added */}
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter notes (optional)"
          />
        </div>
        <button type="submit" className="submit-btn">Schedule Appointment</button>
      </form>
        </div>
    );
}

export default AddPatient;
