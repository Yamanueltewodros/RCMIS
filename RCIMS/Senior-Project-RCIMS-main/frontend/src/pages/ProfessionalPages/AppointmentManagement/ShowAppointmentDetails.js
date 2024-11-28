import React, { useState, useEffect } from "react";
import axios from "axios";
import EditAppointment from "./EditAppointment";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from "@mui/material";

const ShowAppointmentDetails = ({ appointmentId, onGoBack }) => {
    const [appointmentData, setAppointmentData] = useState({
        details: null,
        patientType: null,
        patientName: null,
        professionalName: null,
    });
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAppointmentDetails();
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/appointment/appointment-details/${appointmentId}`
            );

            if (response.data && response.data.appointment) {
                setAppointmentData({
                    details: response.data.appointment,
                    patientType: response.data.patientType,
                    patientName: response.data.patientName,
                    professionalName: response.data.professionalName,
                });
            } else {
                setError("Appointment details not found");
            }
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            setError(`Error fetching appointment details: ${error.message}`);
        }
    };

    const onCancelAppointment = async () => {
        try {
            // show a confirmation dialog to the user
            const confirmation = window.confirm("Are you sure you want to cancel this appointment?");
            
            if (confirmation) {
                await axios.delete(`http://localhost:5000/api/appointment/cancel-appointment/${appointmentId}`);
                onGoBack(true);
            }
        } catch (error) {
            console.error("Error canceling appointment:", error);
            setError("Error canceling appointment: " + error.message);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditCancel = (wasUpdated) => {
        setIsEditing(false);
        if (wasUpdated) {
            fetchAppointmentDetails();
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!appointmentData.details) return <div>Loading...</div>;
    if (isEditing) return <EditAppointment appointmentId={appointmentId} onGoBack={handleEditCancel} />;

    const { details, patientType, patientName } = appointmentData;
    const formattedDate = new Date(details.date).toUTCString().split(' ').slice(0, 4).join(' ');

    return (
        <div className="appointment-details">
            <div class="header">
                <ArrowBackIcon  onClick={onGoBack}/>
                <h3 className="patient-name">Appointment Details</h3>
            </div>

            <div className="container">
                <div className="column1">
                    <AppointmentInfo label="Date" value={formattedDate} />
                    <AppointmentInfo label="Session Number" value={details.sessionNumber} />
                    <AppointmentInfo label="Session Start Time" value={details.startTime} />
                    <AppointmentInfo label="Duration" value={`${details.duration} Hr`} />
                    <button type="submit" background="#0ea5e9" sx={{color:"white", }} fullWidth onClick={handleEditClick}>Edit Appointment</button>
                </div>

                <div className="column2">
                    <AppointmentInfo label="Patient Name" value={patientName || "Not available"} />
                    <AppointmentInfo label="Patient Type" value={patientType || "Not specified"} />
                    <AppointmentInfo label="Appointment Type" value={capitalizeFirstLetter(details.type)} />
                    <AppointmentInfo
                        label="Status"
                        value={capitalizeFirstLetter(details.status)}
                        style={{ color: details.status === "active" ? "green" : "red" }}
                    /> 
                        <button type="submit"fullWidth onClick={() => onCancelAppointment(details._id)}>Cancel Appointment</button>
       
                </div>
            </div>
          
         
            <div className="button-group">
                {/* <button onClick={handleEditClick}>Edit Appointment</button>
                <button fullWidth onClick={() => onCancelAppointment(details._id)}>Cancel Appointment</button> */}
            </div>
        </div>
    );
};

const AppointmentInfo = ({ label, value, style }) => (
   
       <div className="detail-item">
       <p> {label}</p>
        <strong style={style}>{value}</strong>
       </div>
);

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default ShowAppointmentDetails;
