import React, { useState, useEffect } from "react";
import "../../Styling/AdminPageStyles/ProfessionalManagementStyles/ProfessionalManagement.css";
import ProfessionalsList from "./ProfessionalsList";
import AddProfessional from "./AddProfessional";
import ProfessionalReports from "./ProfessionalReports";
import axios from "axios";

const ProfessionalManagement = () => {
  const [activeTab, setActiveTab] = useState("ProfessionalsList");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ speciality: "", experience: "" });
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);

  // Fetch professionals with search and filter options
  const fetchFilteredProfessionals = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/professionals/get-professionals", {
        params: {
          search: searchTerm,
          speciality: filter.speciality,
          experience: filter.experience,
        },
      });
      setFilteredProfessionals(response.data.professionals);
    } catch (error) {
      console.error("Error fetching filtered professionals:", error);
    }
  };

  // Update filtered professionals whenever search/filter changes
  useEffect(() => {
    if (activeTab === "ProfessionalsList") {
      fetchFilteredProfessionals();
    }
  }, [searchTerm, filter, activeTab]);

  // Function to render the correct component based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "ProfessionalsList":
        return <ProfessionalsList professionals={filteredProfessionals} />;
      case "AddProfessional":
        return <AddProfessional />;
      case "ProfessionalReports":
        return <ProfessionalReports />;
      default:
        return <ProfessionalsList professionals={filteredProfessionals} />;
    }
  };

  return (
    <div className="professional-management-page">
      {/* Navigation tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "ProfessionalsList" ? "active" : ""}`}
          onClick={() => setActiveTab("ProfessionalsList")}
        >
          View All Professionals
        </button>
        <button
          className={`tab-button ${activeTab === "AddProfessional" ? "active" : ""}`}
          onClick={() => setActiveTab("AddProfessional")}
        >
          Add Professional
        </button>
        <button
          className={`tab-button ${activeTab === "ProfessionalReports" ? "active" : ""}`}
          onClick={() => setActiveTab("ProfessionalReports")}
        >
          Reports
        </button>
      </div>

     
      {/* Render the component based on the active tab */}
      <div className="tab-content">{renderActiveTab()}</div>
    </div>
  );
};

export default ProfessionalManagement;
