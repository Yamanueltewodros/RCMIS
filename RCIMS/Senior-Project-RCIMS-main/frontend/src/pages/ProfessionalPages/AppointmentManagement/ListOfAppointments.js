import React, { useState } from "react";
import "../ProfessionalStyles/AppointmentList.css";
import ShowAppointmentDetails from "./ShowAppointmentDetails"; // You'll need to create this component
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Paper,
  } from "@mui/material";
const ListOfAppointments = ({ appointments, onAppointmentCancelled }) => {

    // Helper function to format date and time in UTC
    const formatDateTimeUTC = (dateString) => {
        const date = new Date(dateString);
        return date.toUTCString().split(' ').slice(0, 4).join(' ');
    };

    // Ensure we're working with the correct array
    const appointmentsArray = Array.isArray(appointments) ? appointments : appointments?.appointments || [];

    // Check if appointments array has items
    const hasAppointments = appointmentsArray.length > 0;

    const [activeTab, setActiveTab] = useState("ListOfAppointments");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const handleDetails = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setActiveTab("ViewAppointmentDetails");
    };

    const handleGoBack = () => {
        setActiveTab("ListOfAppointments");
        onAppointmentCancelled();
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "ListOfAppointments":
                return renderAppointmentsList();
            case "ViewAppointmentDetails":
                return <ShowAppointmentDetails appointmentId={selectedAppointmentId} onGoBack={handleGoBack} />;
            default:
                return renderAppointmentsList();
        }
    };

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
      }

    const renderAppointmentsList = () => {
        return (
            <>
                <h2>My Appointments</h2>
                {!hasAppointments ? (
                    <p>No appointments found.</p>
                ) : (
                    <Paper maxWidth = {"600px"}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="patient table">
                        <TableHead>
                            <TableRow>

                            <TableCell>No</TableCell>
                            <TableCell><CalendarMonthIcon sx={{paddingRight: "10px"}}/>Date</TableCell>
                            <TableCell>Session Number</TableCell>
                            <TableCell>Status</TableCell>
                          
                            
                            <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {appointmentsArray.map((appointment,index) => (
                            <TableRow key={ appointment._id}>

                                <TableCell>{index + 1}</TableCell>
                                <TableCell><strong>{formatDateTimeUTC(appointment.date)}</strong></TableCell>
                                <TableCell><strong>{appointment.sessionNumber} ({appointment.startTime})</strong></TableCell>
                                <TableCell><strong> <span style={{ color: appointment.status === "active" ? "Green" : "Red",backgroundColor: appointment.status === "active" ? "#f0fdf4" : "#fecaca" , padding: "10px", borderRadius:"5px"}}>{capitalizeFirstLetter(appointment.status)}</span></strong></TableCell>
                              

                                <TableCell>
                                <button className="btn btn-details" onClick={() => handleDetails(appointment._id)}>
                                        Details
                                    </button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    </Paper>

                    
                )}
            </>
        );
    };

    return (
        <div className="appointments-list-container">
            {renderActiveTab()}
        </div>
    );
};

export default ListOfAppointments;
