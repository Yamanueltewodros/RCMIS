import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./ProfessionalStyles/PatientManagement.css";
import ShowPatientDetails from "./ShowPatientDetails"; // Use the imported ShowPatientDetails
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState("ListOfPatients");
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null); // Track selected patient ID for details or progress
  const [viewingProgress, setViewingProgress] = useState(false); // Track if viewing progress
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchPatients();
  }, []);

  // Get current professional
  const currentProfessional = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching current professional:", error);
      throw error;
    }
  };

  // Fetch patients of the current professional
  const fetchPatients = async () => {
    try {
      const professionalResponse = await currentProfessional();
      if (
        professionalResponse &&
        professionalResponse.data &&
        professionalResponse.data.professional &&
        professionalResponse.data.professional.length > 0
      ) {
        const professional = professionalResponse.data.professional[0];
        const response = await axios.get(
          `http://localhost:5000/api/professionals/get-patients-of-professional/${professional._id}`
        );
        setPatients(response.data || []); // Use an empty array if undefined
      } else {
        console.error("No valid professional data available:", professionalResponse);
        setPatients([]); // Set to empty array if no professional data
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]); // Set to empty array on error
    }
  };

  // Handle click for viewing patient's history or details
  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId); // Store the selected patient ID
    setActiveTab("ViewPatientDetails"); // Switch to the "ViewPatientDetails" tab
    setViewingProgress(false); // Ensure progress view is off
  };

  // Handle click for viewing patient's progress
  const handleViewProgress = (patientId) => {
    // Navigate to the ViewProgress page with the selected patient ID
    navigate(`/progress/${patientId}`);
  };

  // Function to go back to the list of patients
  const handleGoBack = () => {
    setActiveTab("ListOfPatients"); // Return to "ListOfPatients"
    setViewingProgress(false); // Ensure progress view is off
  };

  // Function to render the correct component based on the active tab and progress view
  const renderActiveTab = () => {
    if (activeTab === "ViewPatientDetails") {
      if (viewingProgress) {
        return <ShowPatientDetails patientId={selectedPatientId} onGoBack={handleGoBack} fetchPatients={fetchPatients} />; // Render patient details view
      } else {
        return <ShowPatientDetails patientId={selectedPatientId} onGoBack={handleGoBack} fetchPatients={fetchPatients} />; // Render patient details view
      }
    }

    // Default to showing the patient list
    return (
      <ListOfPatients
        patients={patients}
        onViewPatient={handleViewPatient}
        onViewProgress={handleViewProgress} // Pass the progress handler
      />
    );
  };

  return (
    <div className="patient-management-page">
      {/* Navigation tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "ListOfPatients" ? "active" : ""}`}
          onClick={() => setActiveTab("ListOfPatients")}
        >
          View All Patients
        </button>
      </div>

      {/* Render the component based on the active tab */}
      <div className="tab-content">{renderActiveTab()}</div>
    </div>
  );
};

// ListOfPatients Component
const ListOfPatients = ({ patients, onViewPatient, onViewProgress }) => {
  return (
    <Paper sx={{ elevation: 0 }}>
      <div>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Patient List</h2>
        </div>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="patient table">
            <TableHead>
              <TableRow sx={{ boxShadow: 0 }}>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Father's Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Patient Type</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient, index) => (
                <TableRow key={patient._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{patient.user?.name}</TableCell>
                  <TableCell>{patient.user?.fatherName}</TableCell>
                  <TableCell>{patient.user?.phoneNumber}</TableCell>
                  <TableCell>{patient.patientType}</TableCell>

                  <TableCell>
                    <button
                      className="CareGiver-button"
                      onClick={() => onViewPatient(patient._id)}
                    >
                      View Details
                    </button>
                    {/*
                    <button
                      className="Progress-button"
                      onClick={() => onViewProgress(patient._id)} // View Progress button action
                    >
                      View Progress
                    </button>
*/}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
};

export default PatientManagement;
