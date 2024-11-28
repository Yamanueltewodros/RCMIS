import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientHistoryPage = ({ onGoBack }) => {
  const [patientHistory, setPatientHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedHistory, setExpandedHistory] = useState(null);

  // Function to get the logged-in user from localStorage
  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user; // This contains the logged-in user object (including _id)
    } catch (err) {
      console.error("Error getting user from localStorage", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchPatientHistory = async () => {
      const user = getCurrentUser();
      if (!user || !user._id) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/patient-history/get-patient-history/${user._id}` // Fetch history for the patient
        );
        if (response.data.patientHistory.length > 0) {
          setPatientHistory(response.data.patientHistory); // Store the history data
        } else {
          setError("No history available for this patient.");
        }
      } catch (error) {
        setError("Failed to fetch patient history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientHistory();
  }, []);

  const toggleHistoryDetails = (index) => {
    if (expandedHistory === index) {
      setExpandedHistory(null); // Collapse if already open
    } else {
      setExpandedHistory(index); // Expand the clicked one
    }
  };

  return (
    <div className="patient-history-page">
      
      <h2>Patient History</h2>
      {loading && <p>Loading history...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && patientHistory.length > 0 && (
        <div className="history-list">
          {patientHistory.map((historyItem, index) => (
            <div key={index} className="history-card">
              <p className="history-number">{index + 1}</p>
              <p><strong>Date:</strong> {new Date(historyItem.createdAt).toLocaleDateString()}</p>
              <p><strong>Details:</strong> {historyItem.historyData.slice(0, 50)}...</p>

              {/* Display the professional's name and email if available */}
              {historyItem.professional && (
                <p>
                  <strong>Added by:</strong> {historyItem.professionalName}
                </p>
              )}

              <div className="button-container">
                <button
                  className="btn btn-details"
                  onClick={() => toggleHistoryDetails(index)}
                >
                  {expandedHistory === index ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expandedHistory === index && (
                <div className="expanded-details">
                  <p><strong>Full Details:</strong> {historyItem.historyData}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistoryPage;
