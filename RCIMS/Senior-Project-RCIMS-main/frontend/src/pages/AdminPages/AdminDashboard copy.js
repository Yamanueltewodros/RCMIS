import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/AdminPageStyles/adminDashboard.css";

const AdminDashboard = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div>
            <nav>
                <div>
                    <h1>RCMIS</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#appointments">Appointments</a>
                    <a href="#patient-management">Patient Management</a>
                    <a href="#professional-management">Professional Management</a>
                    <a href="#report">Report</a>
                    <a href="#contact">Contact</a>
                    <a href="#help">Help</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>{user.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="container">
                <h2>Admin Dashboard</h2>
                <p>Welcome, {user.name}</p>
                <p>Role: {user.role}</p>
                {/* Add more admin-specific content here */}
            </div>
        </div>
    );
};

export default AdminDashboard;
