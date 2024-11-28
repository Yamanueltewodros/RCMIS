import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from './RCMIS-1-01.svg';

import "./ProfessionalStyles/professionalDashboard.css";
import MySchedule from "./MySchedule";
import AppointmentManagement from "./AppointmentManagement/AppointmentManagement";
import AttachPatient from "./AttachPatient";
import PatientManagement from "./PatientManagement";

import Help from "./Help";
import InfoCard from "../../MuiComponents/InfoCard";
import ProfessionalLineChart from "./ProfessionalChart";
import Messaging from "./Messaging"; // Import Messaging component

// Icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AssessmentSharpIcon from '@mui/icons-material/AssessmentSharp';
import HelpIcon from '@mui/icons-material/Help';
import ChatIcon from '@mui/icons-material/Chat'; 
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NumbersIcon from '@mui/icons-material/Numbers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ensure the semicolon here

const ProfessionalDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState("Overview");

    // State for dashboard metrics
    const [dashboardData, setDashboardData] = useState(null);
    const [upcomingAppointment, setUpcomingAppointment] = useState(null); // State for upcoming appointment
    const [error, setError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNavClick = (component) => {
        setSelectedComponent(component);
    };

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get the user ID from the logged-in user
                const userId = JSON.parse(localStorage.getItem("user"))._id;

                // Fetch professional stats
                const response = await axios.get(`http://localhost:5000/api/report/stats-for-professional/${userId}`);
                console.log("Dashboard Data Response:", response.data);

                setDashboardData({
                    numberOfPatients: response.data.numberOfPatients || 0,
                    numberOfAppointments: response.data.numberOfAppointments || 0,
                    todayAppointments: response.data.todayAppointments || 0,
                    numberOfInpatients: response.data.numberOfInpatients || 0,
                    numberOfOutpatients: response.data.numberOfOutpatients || 0
                });

                // Fetch the upcoming appointment using the provided API
                const appointmentResponse = await axios.get(`http://localhost:5000/api/appointment/user-appointments/${userId}`);
                if (appointmentResponse.data && appointmentResponse.data.appointments.length > 0) {
                    setUpcomingAppointment(appointmentResponse.data.appointments[0]); // Take the first upcoming appointment
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setError("Failed to fetch dashboard data");
            }
        };

        fetchDashboardData();
    }, []);

    const renderUpcomingAppointment = () => {
        if (!upcomingAppointment) {
            return (
                <div className="upcoming-appointment-container">
                    <p className="no-appointment-text">No upcoming appointments found.</p>
                </div>
            );
        }
    
        return (
            <div className="upcoming-appointment-container">
                <h3 className="appointment-header">Upcoming Appointment</h3>
                <div className="appointment-details">
                    <p>
                        <EventIcon className="appointment-icon" />
                        <strong>Date:</strong> {new Date(upcomingAppointment.date).toLocaleDateString()}
                    </p>
                    <p>
                        <NumbersIcon className="appointment-icon" />
                        <strong>Session Number:</strong> {upcomingAppointment.sessionNumber || 'N/A'}
                    </p>
                    
                    <p>
                        <AccessTimeIcon className="appointment-icon" />
                        <strong>Duration:</strong> {upcomingAppointment.duration || 'N/A'} Hr
                    </p>
                   
                    <p>
                        <CheckCircleIcon className="appointment-icon" />
                        <strong>Status:</strong> 
                        <span className={`status-badge ${upcomingAppointment.status.toLowerCase()}`}>
                            {upcomingAppointment.status || 'N/A'}
                        </span>
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                    <h2>Professional Dashboard</h2>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${selectedComponent === "Overview" ? "active" : ""}`} onClick={() => handleNavClick("Overview")}>
                        <HomeOutlinedIcon /><span className="menu-title">Home</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "MySchedule" ? "active" : ""}`} onClick={() => handleNavClick("MySchedule")}>
                        <EditCalendarOutlinedIcon /><span className="menu-title">My Schedule</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Appointment" ? "active" : ""}`} onClick={() => handleNavClick("Appointment")}>
                        <EditCalendarOutlinedIcon /><span className="menu-title">Appointments</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "AttachPatient" ? "active" : ""}`} onClick={() => handleNavClick("AttachPatient")}>
                        <PersonAddIcon /> <span className="menu-title">Attach Patient</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "PatientManagement" ? "active" : ""}`} onClick={() => handleNavClick("PatientManagement")}>
                        <ManageAccountsIcon /> <span className="menu-title">Patients</span>
                    </li>
                    
                    <li className={`menu-item ${selectedComponent === "Help" ? "active" : ""}`} onClick={() => handleNavClick("Help")}>
                        <HelpIcon /> <span className="menu-title">Help Center</span>
                    </li>

                    {/* Messaging Menu Item */}
                    <li className={`menu-item ${selectedComponent === "Messaging" ? "active" : ""}`} onClick={() => handleNavClick("Messaging")}>
                        <ChatIcon /> <span className="menu-title">Messaging</span>
                    </li>

                    <li className="menu-item" onClick={handleLogout}>
                        <LogoutIcon /><span className="menu-title">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="Navbar">
                    <nav className="bg-white font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 sm:items-baseline w-full">
                        <div className="mb-2 sm:mb-0 flex flex-row">
                            <div className="h-10 w-10 self-center mr-2">
                                <img className="h-10 w-10 self-center" src="https://image.emojipng.com/511/267511-small.png" alt="Icon" />
                            </div>
                            <div>
                                <a href="#" className="text-2xl no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">{`Hello ${user?.name} `}</a><br />
                                <span className="text-xs text-grey-dark">Logged in As Professional</span>
                            </div>
                        </div>
                        <div className="sm:mb-0 self-center">
                            <NotificationsIcon onClick={() => handleNavClick('Notifications')} />
                            <span className="px-3">|</span>
                            <LogoutIcon onClick={handleLogout} />
                        </div>
                    </nav>
                </div>

                {/* Render Dashboard based on selected component */}
                <div className="dashboard">
                    {selectedComponent === "Overview" && (
                        <>
                            <div className="cards">
                                <InfoCard title="Total Active Patients" total={dashboardData?.numberOfPatients} increase={10} percentage={15} conditions="Active Patients" />
                                <InfoCard title="In-Patients" total={dashboardData?.numberOfInpatients} increase={5} percentage={10} conditions="In-Patients" />
                                <InfoCard title="Out-Patients" total={dashboardData?.numberOfOutpatients} increase={7} percentage={8} conditions="Out-Patients" />
                                <InfoCard title="Total Appointments" total={dashboardData?.numberOfAppointments} increase={12} percentage={5} conditions="Appointments" />
                                <InfoCard title="Today's Appointments" total={dashboardData?.todayAppointments} increase={7} percentage={3} conditions="Today's Appointments" />
                            </div>

                            {/* Render Line Chart */}
                            {dashboardData ? (
                                <div className="chart-and-appointment">
                                    <div className="chart-container">
                                        <ProfessionalLineChart dashboardData={dashboardData} />
                                    </div>
                                    <div className="appointment-container">
                                        {renderUpcomingAppointment()} {/* Render the upcoming appointment */}
                                    </div>
                                </div>
                            ) : (
                                <p>Loading...</p>  // Show loading if data isn't available
                            )}
                        </>
                    )}
                    {selectedComponent === "MySchedule" && <MySchedule />}
                    {selectedComponent === "Appointment" && <AppointmentManagement />}
                    {selectedComponent === "AttachPatient" && <AttachPatient />}
                    {selectedComponent === "PatientManagement" && <PatientManagement />}
                    
                    {selectedComponent === "Help" && <Help />}
                    {selectedComponent === "Messaging" && <Messaging />} {/* Render Messaging component */}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDashboard;
