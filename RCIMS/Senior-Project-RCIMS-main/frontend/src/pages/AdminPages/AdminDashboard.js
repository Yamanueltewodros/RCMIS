import "../Styling/AdminPageStyles/adminDashboard.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PatientManagement from "./PatientManagement/PatientManagement";
import ProfessionalManagement from "./ProfessionalManagement/ProfessionalManagement";
import Report from "./Report";
import Contact from "./Contact";
import Help from "./Help";
import logo from "../../pages/PatientPages/RCMIS-1-01.svg";
import AdminEngage from "./AdminEngage";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import SummarizeIcon from '@mui/icons-material/Summarize';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CommentIcon from '@mui/icons-material/Comment';
import PatientStat from "../../MuiComponents/GraphComponent";
import InfoCard from "../../MuiComponents/InfoCard";
import Calendar from "../../MuiComponents/calander";
import Feedbacks from "./FeedbackManagement/Feedbacks";
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';

const AdminDashboard = ({ user }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPatientType, setFilterPatientType] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [error, setError] = useState(null);
    const [isViewingCaregiver, setIsViewingCaregiver] = useState(false);

    // States for home report data (API connection for home)
    const [userStats, setUserStats] = useState({
        totalPatients: 0,
        totalActivePatients: 0,
        totalProfessionals: 0,
        totalActiveProfessionals: 0,
        malePatientCount: 0,
        femalePatientCount: 0,
        totalDischargedPatients: 0,
        totalInpatients: 0,
        totalOutpatients: 0,
    });

    const [appointmentStats, setAppointmentStats] = useState({
        totalAppointments: 0,
        todayAppointments: 0,
    });

    useEffect(() => {
        fetchPatients();
        fetchUserStats(); // Fetch home report data on component load
        fetchAppointmentStats(); // Fetch appointment statistics
    }, [searchTerm, filterPatientType, filterGender]);

    // Fetch patients data (as in your original code)
    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/patients/get-patients", {
                params: {
                    search: searchTerm,
                    patientType: filterPatientType,
                    gender: filterGender,
                },
            });
            setPatients(response.data.patients || response.data);
        } catch (error) {
            setError(`Failed to fetch patients. ${error.response?.data?.message || error.message}`);
        }
    };

    // Fetch home report stats from the backend (API connection for the "Overview" part)
    const fetchUserStats = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/report/user-stats");
            setUserStats(response.data);  // Populate the state with the API data
        } catch (error) {
            console.error("Error fetching user stats:", error);
        }
    };

    // Fetch appointment statistics from the backend
    const fetchAppointmentStats = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/report/appointment-stats");
            setAppointmentStats(response.data);
        } catch (error) {
            console.error("Error fetching appointment stats:", error);
        }
    };

    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`.toLowerCase();
        const matchesSearchTerm = fullName.includes(searchTerm.toLowerCase());
        const matchesPatientType = !filterPatientType || patient.patientType === filterPatientType;
        const matchesGender = !filterGender || patient.user?.gender === filterGender;
        return matchesSearchTerm && matchesPatientType && matchesGender;
    });

    const handleDetails = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/patients/get-patient-information/${patientId}`);
            setSelectedPatient(response.data.patient);
            setIsEditing(false);
            setIsViewingCaregiver(false);
        } catch (error) {
            setError(`Failed to fetch patient details. ${error.response?.data?.message || error.message}`);
        }
    };

    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState("Overview");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNavClick = (component) => {
        setSelectedComponent(component);
    };

    // Data for the graph component
    const graphData = {
        labels: ['Total Patients', 'Active Patients', 'Discharged Patients', 'In-Patients', 'Out-Patients'],
        datasets: [
            {
                label: 'Patient Stats',
                data: [
                    userStats.totalPatients,
                    userStats.totalActivePatients,
                    userStats.totalDischargedPatients,
                    userStats.totalInpatients,
                    userStats.totalOutpatients,
                ],
                backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
            },
        ],
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">
                    <img src={logo} alt="WeCare Logo" />
                    <h2>Admin Dashboard</h2>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${selectedComponent === "Overview" ? "active" : ""}`} onClick={() => handleNavClick("Overview")}>
                        <DashboardIcon /><span className="menu-title">Home</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "PatientManagement" ? "active" : ""}`} onClick={() => handleNavClick("PatientManagement")}>
                        <PersonIcon /><span className="menu-title">Patients</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "ProfessionalManagement" ? "active" : ""}`} onClick={() => handleNavClick("ProfessionalManagement")}>
                        <PeopleIcon /><span className="menu-title">Professionals</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Report" ? "active" : ""}`} onClick={() => handleNavClick("Report")}>
                        <SummarizeIcon /><span className="menu-title">Report</span>
                    </li>
                    
                    <li className={`menu-item ${selectedComponent === "Engage" ? "active" : ""}`} onClick={() => handleNavClick("Engage")}>
                        <PersonAddDisabledIcon /><span className="menu-title">Engage</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Feedback" ? "active" : ""}`} onClick={() => handleNavClick("Feedback")}>
                        <CommentIcon /><span className="menu-title">Feedback</span>
                    </li>
                    <li className={`menu-item ${selectedComponent === "Help" ? "active" : ""}`} onClick={() => handleNavClick("Help")}>
                        <LiveHelpIcon /><span className="menu-title">Help & Center</span>
                    </li>
                    <li className="menu-item" onClick={handleLogout}>
                        <LogoutIcon /><span className="menu-title">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="Navbar">
                    <nav class="bg-white font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 sm:items-baseline w-full">
                        <div class="mb-2 sm:mb-0 flex flex-row">
                            <div className="Menu-icon">
                                <MenuIcon />
                            </div>
                            <div class="h-10 w-10 self-center mr-2">
                                <img class="h-10 w-10 self-center" src="https://image.emojipng.com/511/267511-small.png" />
                            </div>
                            <div>
                                <a href="#" class="text-2xl no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">{`Hello ${user.name} `}</a><br />
                                <span class="text-xs text-grey-dark">Logged in As Admin</span>
                            </div>
                        </div>

                        <div class="sm:mb-0 self-center">
                            <NotificationsActiveIcon onClick={() => handleNavClick('Notifications')} />
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
                                <InfoCard
                                    title="Men Patients"
                                    total={userStats.malePatientCount || 0}  
                                    increase={19}  
                                    percentage={15}  
                                    conditions="Men Patients over the last 7 days"
                                />
                                <InfoCard
                                    title="Women Patients"
                                    total={userStats.femalePatientCount || 0}  
                                    increase={25}  
                                    percentage={20}  
                                    conditions="Women Patients over the last 7 days"
                                />
                                <InfoCard
                                    icon={<PersonIcon />}
                                    title="Total Patients (Active)"
                                    total={userStats.totalActivePatients || 0}  
                                    increase={25}  
                                    percentage={20}  
                                    conditions="Active Patients"
                                />
                                <InfoCard
                                    icon={<PeopleIcon />}
                                    title="Total Professionals (Active)"
                                    total={userStats.totalActiveProfessionals || 0}  
                                    increase={10}  
                                    percentage={10}  
                                    conditions="Active Professionals"
                                />
                                <InfoCard
                                    title="Discharged Patients"
                                    total={userStats.totalDischargedPatients || 0}  
                                    increase={125}  
                                    percentage={10}  
                                    conditions="Discharged Patients"
                                />
                                <InfoCard
                                    title="In-Patients"
                                    total={userStats.totalInpatients || 0}  
                                    increase={10}  
                                    percentage={5}  
                                    conditions="In-Patients"
                                />
                                <InfoCard
                                    title="Out-Patients"
                                    total={userStats.totalOutpatients || 0}  
                                    increase={15}  
                                    percentage={8}  
                                    conditions="Out-Patients"
                                />
                                <InfoCard
                                    title="Active Appointments"
                                    total={appointmentStats.totalAppointments || 0}  
                                    increase={12}  
                                    percentage={5}  
                                    conditions="Active Appointments"
                                />
                                <InfoCard
                                    title="Today's Appointments"
                                    total={appointmentStats.todayAppointments || 0}  
                                    increase={7}  
                                    percentage={3}  
                                    conditions="Appointments Today"
                                />
                            </div>

                            {/* Statistics and Calendar */}
                            <div className="StatAndCal">
                                <div className="statistics">
                                    <h2>Patient Statistics</h2>
                                    <PatientStat data={graphData} /> {/* Connected graph */}
                                </div>
                                <Calendar />
                            </div>
                        </>
                    )}
                    {selectedComponent === "PatientManagement" && <PatientManagement />}
                    {selectedComponent === "ProfessionalManagement" && <ProfessionalManagement />}
                    {selectedComponent === "Report" && <Report />}
                    {selectedComponent === "Engage" && <AdminEngage />}
                    {selectedComponent === "Feedback" && <Feedbacks />}
                    {selectedComponent === "Contact" && <Contact />}
                    {selectedComponent === "Help" && <Help />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
