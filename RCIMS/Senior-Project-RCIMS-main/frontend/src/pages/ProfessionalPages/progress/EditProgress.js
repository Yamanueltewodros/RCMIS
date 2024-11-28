import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, Button, TextField, Box } from "@mui/material";

const EditProgress = () => {
    const { patientId } = useParams(); // Get the patientId from URL params
    const [progressData, setProgressData] = useState({
        height: "",
        weight: "",
        bloodPressure: "",
        heartRate: "",
        respiratoryRate: "",
        spo2: "",
        bloodglucose: "",
        ALT: "",
        AST: "",
        ALP: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/progress/get-progress-by-id/${patientId}` // Use the correct endpoint
                );
                setProgressData(response.data); // Fill the form with fetched data
                setLoading(false);
            } catch (error) {
                console.error("Error fetching progress data:", error);
                setError("Failed to load progress data. Please try again.");
                setLoading(false);
            }
        };

        if (patientId) {
            fetchProgressData(); // Fetch data when patientId is available
        } else {
            setError("No patient ID provided.");
            setLoading(false);
        }
    }, [patientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProgressData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/progress/edit-progress/${patientId}`, // Use the patientId for updating
                progressData
            );
            alert("Progress updated successfully!");
            navigate(`/progress/${patientId}`); // Navigate back to the progress page after saving
        } catch (error) {
            console.error("Failed to update progress:", error);
        }
    };

    if (loading) {
        return <div>Loading progress data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={pageStyle}>
            <h1>Edit Patient Progress</h1>
            <Paper elevation={0} style={paperStyle}>
                {/* Part 1: Physical details */}
                <TextField
                    label="Height (m)"
                    name="height"
                    value={progressData.height}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Weight (kg)"
                    name="weight"
                    value={progressData.weight}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Blood Pressure"
                    name="bloodPressure"
                    value={progressData.bloodPressure}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Heart Rate"
                    name="heartRate"
                    value={progressData.heartRate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Respiratory Rate"
                    name="respiratoryRate"
                    value={progressData.respiratoryRate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Part 2: Medical details */}
                <TextField
                    label="SpO2 (%)"
                    name="spo2"
                    value={progressData.spo2}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Blood Glucose (mg/dL)"
                    name="bloodglucose"
                    value={progressData.bloodglucose}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="ALT"
                    name="ALT"
                    value={progressData.ALT}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="AST"
                    name="AST"
                    value={progressData.AST}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="ALP"
                    name="ALP"
                    value={progressData.ALP}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
            </Paper>

            {/* Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <Button variant="contained" onClick={() => navigate(`/progress/${patientId}`)}>
                    Back
                </Button>
                <Button variant="contained" onClick={handleSave}>
                    Save
                </Button>
            </Box>
        </div>
    );
};

const pageStyle = {
    textAlign: "center",
    margin: "20px",
};

const paperStyle = {
    padding: "20px",
    marginBottom: "20px",
};

export default EditProgress;
