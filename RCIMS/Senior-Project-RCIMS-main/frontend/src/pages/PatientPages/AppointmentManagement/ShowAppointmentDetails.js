import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowAppointmentDetails = ({ appointmentId, onGoBack }) => {
    const [appointmentData, setAppointmentData] = useState({
        details: null,
        patientType: null,
        patientName: null,
        professionalName: null,
        professionalDepartment: null,
    });
    const [error, setError] = useState(null);

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
                    professionalDepartment: response.data.professionalDepartment,
                });
            } else {
                setError("Appointment details not found");
            }
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            setError(`Error fetching appointment details: ${error.message}`);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!appointmentData.details) return <div>Loading...</div>;

    const { details, professionalName, professionalDepartment } = appointmentData;
    const formattedDate = new Date(details.date).toUTCString().split(' ').slice(0, 4).join(' ');

    return (
        <div className="appointment-details">
            <h2>Appointment Details</h2>
            <AppointmentInfo label="Date" value={formattedDate} />
            <AppointmentInfo label="Session Number" value={details.sessionNumber} />
            <AppointmentInfo label="Session Start Time" value={details.startTime} />
            <AppointmentInfo label="Duration" value={`${details.duration} Hr`} />
            <AppointmentInfo label="Professional Name" value={professionalName || "Not available"} />
            <AppointmentInfo label="Professional Department" value={professionalDepartment || "Not available"} />
            <AppointmentInfo label="Appointment Type" value={capitalizeFirstLetter(details.type)} />
            <AppointmentInfo 
                label="Status" 
                value={capitalizeFirstLetter(details.status)}
                style={{ color: details.status === "active" ? "green" : "red" }}
            />
            <div className="button-group">
                <button onClick={onGoBack}>Back to List</button>
            </div>
        </div>
    );
};

const AppointmentInfo = ({ label, value, style }) => (
    <p>
        {label}: <strong style={style}>{value}</strong>
    </p>
);

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default ShowAppointmentDetails;
