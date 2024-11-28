import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login"; // Import the Login component
import Signup from "./pages/signup/Signup"; // Import the Signup component
import Dashboard from "./pages/Dashboard/dashboard"; // Import the Dashboard component
import ProfessionalManagement from "./pages/AdminPages/ProfessionalManagement/ProfessionalManagement"; // Import the Professional Management component
import ViewProgress from "./pages/ProfessionalPages/progress/viewprogress"; // Import the ViewProgress component
import AddProgress from "./pages/ProfessionalPages/progress/AddProgress"; // Import the AddProgress component

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Default route to Login */}
                <Route path="/login" element={<Login />} /> {/* Login route */}
                <Route path="/signup" element={<Signup />} /> {/* Signup route */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
                <Route path="/overview" element={<ProfessionalManagement />} /> {/* Professional Management route */}
                <Route path="/progress/:patientId" element={<ViewProgress />} /> {/* View Progress route */}
                <Route path="/add-patient-progress/:patientId" element={<AddProgress />} /> {/* Dynamic Add Progress route */}
            </Routes>
        </div>
    );
}

export default App;
