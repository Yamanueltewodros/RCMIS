import React, { useState, useEffect } from "react";
import "../Styling/AdminPageStyles/PatientManagement.css";
import ListOfPatients from "./ListOfPatients";
import AddPatient from "./AddPatient";
import EditPatient from "./EditPatient";
import axios from "axios";

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState("ListOfPatients");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ patientType: "", employmentStatus: "" });
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Fetch patients with search and filter options
  const fetchFilteredPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/patients/get-patients", {
        params: {
          search: searchTerm,
          patientType: filter.patientType,
          employmentStatus: filter.employmentStatus,
        },
      });
      setFilteredPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching filtered patients:", error);
    }
  };

  // Update filtered patients whenever search/filter changes
  useEffect(() => {
    if (activeTab === "ListOfPatients") {
      fetchFilteredPatients();
    }
  }, [searchTerm, filter, activeTab]);

  // Function to render the correct component based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "ListOfPatients":
        return <ListOfPatients patients={filteredPatients} />;
      case "AddPatient":
        return <AddPatient />;
      case "EditPatient":
        return <EditPatient />;
      default:
        return <ListOfPatients patients={filteredPatients} />;
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
          className={`tab-button ${activeTab === "EditPatient" ? "active" : ""}`}
          onClick={() => setActiveTab("EditPatient")}
        >
          Edit Patient
        </button>
      </div>

      
      {/* Render the component based on the active tab */}
      <div className="tab-content">{renderActiveTab()}</div>
    </div>
  );
};

export default PatientManagement;
