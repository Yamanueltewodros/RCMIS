import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppointmentManagement from "./AppointmentManagement/AppointmentManagement";
import MedicalHistory from "./MedicalHistory";
import Notifications from "./Notifications";
import Messaging from "./Messaging";
import GeneralReport from "./GeneralReport";
import Feedback from "./Feedback";
import Help from "../ProfessionalPages/Help";
import "./PatientPagesStyles/PatientDashboard.css";
import logo from "./RCMIS-1-01.svg";
import Engage from "./Engage"; // Import Engage component
import InfoCard from "../../MuiComponents/InfoCard"; // Use InfoCard for Home stats

// Icons
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PatientDashboard = ({ patient, user }) => {
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState("Home");
    const [homeData, setHomeData] = useState({
        numberOfAppointments: 0,
        todayAppointments: 0,
        numberOfAssignedProfessionals: 0,
        assignedProfessionals: [],
    });
    const [appointments, setAppointments] = useState([]); // State to store appointments
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("patient");
        navigate("/login");
    };

    const handleNavClick = (component) => {
        setSelectedComponent(component);
    };

    // Fetch data for the Home component
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/report/stats-for-patient/${user._id}`);
                setHomeData({
                    numberOfAppointments: response.data.numberOfAppointments || 0,
                    todayAppointments: response.data.todayAppointments || 0,
                    numberOfAssignedProfessionals: response.data.numberOfAssignedProfessionals || 0,
                    assignedProfessionals: response.data.assignedProfessionals || [],
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching home data:", error);
                setError("Failed to load data.");
                setLoading(false);
            }
        };

        if (user && user._id) {
            fetchHomeData();
        } else {
            setError("User ID is missing");
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                if (user && user._id) {
                    const response = await axios.get(`http://localhost:5000/api/appointment/user-appointments/${user._id}`);
                    console.log("Appointments fetched: ", response.data); // Log the fetched appointments
    
                    // Assuming response.data.appointments contains the actual appointments array
                    if (response.data && response.data.appointments) {
                        setAppointments(response.data.appointments); // Access appointments from the response
                    } else {
                        setAppointments([]); // Set to empty if no appointments found
                    }
                } else {
                    console.log("User ID is missing. Unable to fetch appointments.");
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setError("Failed to load appointments.");
            }
        };
    
        fetchAppointments();
    }, [user]);
    

    const renderHomeCards = () => {
        return (
            <div className="cards">
                <InfoCard title="Total Appointments" total={homeData.numberOfAppointments} />
                <InfoCard title="Today's Appointments" total={homeData.todayAppointments} />
                <InfoCard title="Assigned Professionals" total={homeData.numberOfAssignedProfessionals} />
            </div>
        );
    };



const renderCurrentAppointment = () => {
    if (appointments.length === 0) {
        return <p className="no-appointment-text">No appointments found.</p>;
    }

    const currentAppointment = appointments.find(appointment => appointment.status.toLowerCase() === 'active');

    if (!currentAppointment) {
        return <p className="no-appointment-text">No active appointments found.</p>;
    }

    if (!currentAppointment.date) {
        return <p className="no-appointment-text">No valid active appointment found.</p>;
    }

    return (
        <div className="current-appointment-container">
            <h3 className="appointment-title">Upcoming Active Appointment</h3>
            <div className="appointment-details">
                <p>
                    <EventIcon className="appointment-icon" />
                    <strong>Date:</strong> {new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Africa/Nairobi',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour12: true
                    }).format(new Date(currentAppointment.date))}
                </p>
                <p>
                    <ScheduleIcon className="appointment-icon" />
                    <strong>Session Number:</strong> {currentAppointment.sessionNumber || 'N/A'}
                </p>
                <p>
                    <AccessTimeIcon className="appointment-icon" />
                    <strong>Duration:</strong> {currentAppointment.duration || 'N/A'} Hr
                </p>
                <p>
                    <CheckCircleIcon className="appointment-icon" />
                    <strong>Status:</strong> 
                    <span className={`status-badge ${currentAppointment.status.toLowerCase()}`}>
                        {currentAppointment.status || 'N/A'}
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
                    <img src={logo} alt="HealthCare Logo" />
                    <h2 className="text-sm">Patient Dashboard</h2>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${selectedComponent === "Home" ? "active" : ""}`} onClick={() => handleNavClick("Home")}>
                        <HomeOutlinedIcon /><span className="menu-title">Home</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Appointments" ? "active" : ""}`} onClick={() => handleNavClick("Appointments")}>
                        <CalendarMonthIcon /><span className="menu-title">Appointments</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "MedicalHistory" ? "active" : ""}`} onClick={() => handleNavClick("MedicalHistory")}>
                        <AssessmentIcon /> <span className="menu-title">Medical History</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Notifications" ? "active" : ""}`} onClick={() => handleNavClick("Notifications")}>
                        <NotificationsIcon /> <span className="menu-title">Notifications</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Messaging" ? "active" : ""}`} onClick={() => handleNavClick("Messaging")}>
                        <ChatBubbleIcon /> <span className="menu-title">Messaging</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "GeneralReport" ? "active" : ""}`} onClick={() => handleNavClick("GeneralReport")}>
                        <SummarizeIcon /> <span className="menu-title">General Report</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Feedback" ? "active" : ""}`} onClick={() => handleNavClick("Feedback")}>
                        <CommentIcon /> <span className="menu-title">Feedback</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Engage" ? "active" : ""}`} onClick={() => handleNavClick("Engage")}>
                        <PersonAddDisabledIcon /> <span className="menu-title">Engage</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Help" ? "active" : ""}`} onClick={() => handleNavClick("Help")}>
                        <SummarizeIcon /> <span className="menu-title">Help</span>
                    </li>
                    <li className="menu-item" onClick={handleLogout}>
                        <LogoutIcon /><span className="menu-title">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main">
                <div className="Navbar">
                    <nav className="bg-white font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 sm:items-baseline w-full">
                        <div className="mb-2 sm:mb-0 flex flex-row">
                            <div className="h-10 w-10 self-center mr-2">
                                <img className="h-10 w-10 self-center" src="https://image.emojipng.com/511/267511-small.png" alt="Icon" />
                            </div>
                            <div>
                                <a href="#" className="text-2xl no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">{`Hello ${user.name} `}</a><br />
                                <span className="text-xs text-grey-dark">Beautiful New Tagline</span>
                            </div>
                        </div>
                        <div className="sm:mb-0 self-center">
                            <NotificationsIcon onClick={() => handleNavClick('Notifications')} />
                            <span className="px-3">|</span>
                            <LogoutIcon onClick={handleLogout} />
                        </div>
                    </nav>
                </div>

                <div className="main-content">
                    <div className="dashboard">
                        {selectedComponent === "Home" && (
                            <div>
                                {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                                    <>
                                        {renderHomeCards()}
                                        {renderCurrentAppointment()} {/* Display the first/current appointment */}
                                    </>
                                )}
                            </div>
                        )}
                        {selectedComponent === "Appointments" && <AppointmentManagement patient={patient} />}
                        {selectedComponent === "MedicalHistory" && <MedicalHistory patient={patient} />}
                        {selectedComponent === "Notifications" && <Notifications patient={patient} />}
                        {selectedComponent === "Messaging" && <Messaging patient={patient} />}
                        {selectedComponent === "GeneralReport" && <GeneralReport patient={patient} />}
                        {selectedComponent === "Feedback" && <Feedback patient={patient} />}
                        {selectedComponent === "Engage" && <Engage patient={patient} />} {/* Render Engage component */}
                        {selectedComponent === "Help" && <Help patient={patient} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
