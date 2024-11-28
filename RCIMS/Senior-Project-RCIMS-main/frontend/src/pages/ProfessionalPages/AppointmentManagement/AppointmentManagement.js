import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ProfessionalStyles/AppointmentManagement.css";
import ListOfAppointments from "./ListOfAppointments";
import AddAppointment from "./AddAppointment";

const AppointmentManagement = () => {
    const [activeTab, setActiveTab] = useState("ListOfAppointments");
    const [fetchAppointments, setFetchAppointments] = useState([]);
    
    const fetchedAppointments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await axios.get(`http://localhost:5000/api/appointment/user-appointments/${user._id}`);
            setFetchAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    useEffect(() => {
        if (activeTab === "ListOfAppointments") { 
            fetchedAppointments();
        }
    }, [activeTab]);

    // Function to render the correct component based on the active tab
    const renderActiveTab = () => {
        switch (activeTab) {
            case "ListOfAppointments":
                return <ListOfAppointments 
                    appointments={fetchAppointments} 
                    onAppointmentCancelled={fetchedAppointments}
                />; 
            case "AddAppointment":
                return <AddAppointment onAppointmentAdded={fetchedAppointments} />;
            default:
                return <ListOfAppointments 
                    appointments={fetchAppointments} 
                    onAppointmentCancelled={fetchedAppointments}
                />; 
        }
    };

    return (
        <div className="appointment-management-page">
            {/* Navigation tabs */}
            <div className="tabs">
                <button
                    className={`tab-button ${
                        activeTab === "ListOfAppointments" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("ListOfAppointments")}
                >
                    View All Appointments
                </button>
                <button
                    className={`tab-button ${
                        activeTab === "AddAppointment" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("AddAppointment")}
                >
                    Add Appointment
                </button>
            </div>

            {/* Render the component based on the active tab */}
            <div className="tab-content">{renderActiveTab()}</div>
        </div>
    );
};

export default AppointmentManagement;
