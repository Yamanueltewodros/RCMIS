import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/AddPatientHistory.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TextField } from "@mui/material";

const AddPatientHistory = ({ patientId, onGoBack }) => {
  const [formData, setFormData] = useState({
    history: "" 
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [professionalId, setProfessionalId] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentProfessional = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
        );
        if (response.data.professional.length > 0) {
          setProfessionalId(response.data.professional[0]._id); 
        }
      } catch (error) {
        console.error("Error fetching professional ID:", error);
        setError("Failed to fetch professional ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfessional();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      setError("Please wait while we fetch the necessary information.");
      return;
    }

    try {
      if (!professionalId || !patientId) {
        setError("Missing professional or patient information. Please try again.");
        return;
      }

      const requestData = {
        patientId, 
        professionalId, 
        historyData: formData.history  
      };

      const response = await axios.post(
        'http://localhost:5000/api/patient-history/add-Patient-History', 
        requestData
      );

      if (response.status === 201) {
        setSuccess("Patient history added successfully!");
        setFormData({
          history: "" 
        });
        setError(null); 
      }
    } catch (error) {
      setError("Error adding patient history. Please try again.");
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="add-patient-history">
            <div class="header">
            <ArrowBackIcon className=".back-button" onClick={onGoBack}/>
            <h3 className="patient-name">Medical Histroy Chart</h3>
        </div>

      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="wide-textarea-container">
        {/* <TextField
          id="history"
          name="history"
          value={formData.history}
          onChange={handleChange}
          required
          placeholder="Enter patient history here..."
          multiline
          rows={2}
          fullWidth
        /> */}
          <textarea 
            id="history"
            name="history"
            className="wide-textarea "
            value={formData.history}
            onChange={handleChange}
            required
            placeholder="Enter patient history here..."
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPatientHistory;
