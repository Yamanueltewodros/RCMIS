import React, { useState, useEffect } from "react";
import "../../Styling/AdminPageStyles/PatientManagement.css";
import ListOfPatients from "./ListOfPatients"; 
import AddPatient from "./AddPatient";
import PatientsToDischarge from "./PatientsToDischarge";

import axios from "axios";

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState("ListOfPatients");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Fetch patients based on the search term and filter options
  const fetchFilteredPatients = async () => {
    try {
      if (searchTerm) {
        // Search patients by the search term
        const response = await axios.get(`http://localhost:5000/api/patients/search-patient/${searchTerm}`);
        setFilteredPatients(response.data); // Update the state with the search results
      } else {
        // Fetch all patients if no search term is provided
        const response = await axios.get("http://localhost:5000/api/patients/get-patients");
        setFilteredPatients(response.data.patients); // Update state with all patients if no search
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Update the filtered patients when the search term, filter, or active tab changes
  useEffect(() => {
    if (activeTab === "ListOfPatients") {
      fetchFilteredPatients(); // Call the fetch function when the active tab is 'ListOfPatients'
    }
  }, [searchTerm, activeTab]);

  // Function to render the correct component based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "ListOfPatients":
        return <ListOfPatients patients={filteredPatients} />; // Updated to use ListOfPatients
      case "AddPatient":
        return <AddPatient />;
      case "PatientsToDischarge":
        return <PatientsToDischarge />;
      default:
        return <ListOfPatients patients={filteredPatients} />; // Updated to use ListOfPatients
    }
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
        <button
          className={`tab-button ${activeTab === "AddPatient" ? "active" : ""}`}
          onClick={() => setActiveTab("AddPatient")}
        >
          Add Patient
        </button>
        <button
          className={`tab-button ${activeTab === "PatientsToDischarge" ? "active" : ""}`}
          onClick={() => setActiveTab("PatientsToDischarge")}
        >
          Patients to Discharge
        </button>
      </div>

      {/* Render the component based on the active tab */}
      <div className="tab-content">{renderActiveTab()}</div>
    </div>
  );
};

export default PatientManagement;
