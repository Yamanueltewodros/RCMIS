import React from "react";

// Import role-specific dashboard components
import AdminDashboard from "../AdminPages/AdminDashboard";
import PatientDashboard from "../PatientPages/PatientDashboard";
import ProfessionalDashboard from "../ProfessionalPages/ProfessionalDashboard";

const Dashboard = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // const handleLogout = () => {
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("user");
    //     navigate("/login");
    // };

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch("http://localhost:5000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const renderDashboard = () => {
        switch (user.role) {
            case "admin":
                return <AdminDashboard user={user} />;
            case "patient":
                return <PatientDashboard user={user} />;
            case "professional":
                return <ProfessionalDashboard user={user} />;
            default:
                return <div>Unknown role</div>;
        }
    };

    return (
        <div>
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;
