import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Divider,
    Grid,
    Box,
} from "@mui/material";

const ViewProgress = ({ patientId }) => {
    const [progress, setProgress] = useState([]);
    const [selectedProgress, setSelectedProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rangeDialogOpen, setRangeDialogOpen] = useState(false);
    const [selectedMeasure, setSelectedMeasure] = useState(null); // Track selected measure for range popup
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/progress/get-all-progress/${patientId}`
                );
                setProgress(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching progress data:", error);
                setError("Failed to load progress data. Please try again.");
                setLoading(false);
            }
        };

        if (patientId) {
            fetchProgressData();
        } else {
            setError("No patient ID provided.");
            setLoading(false);
        }
    }, [patientId]);

    const handleViewDetails = async (progressId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/progress/get-progress-by-id/${progressId}`
            );
            setSelectedProgress(response.data);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching progress details:", error);
            setError("Failed to load progress details.");
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedProgress(null);
    };

    const handleOpenRangeDialog = (measure) => {
        setSelectedMeasure(measure);
        setRangeDialogOpen(true);
    };

    const handleCloseRangeDialog = () => {
        setRangeDialogOpen(false);
        setSelectedMeasure(null);
    };

    const normalRanges = {
        height: "1.50m - 2.00m",
        weight: "50kg - 100kg",
        bmi: "18.5 - 24.9",
        bloodPressure: "90/60 - 120/80 mmHg",
        heartRate: "60 - 100 bpm",
        respiratoryRate: "12 - 20 breaths/min",
        spo2: "95% - 100%",
        bloodglucose: "70 - 100 mg/dL",
        CBC: "4.0 - 11.0 x 10^9/L",
        ALT: "7 - 56 U/L",
        AST: "10 - 40 U/L",
        ALP: "44 - 147 U/L",
        serumCreatinine: "0.6 - 1.2 mg/dL",
        urinalysis: "Negative for infection",
        frequencyOfUse: "0 times",
        quantityOfUse: "0 units",
        numberOfCravings: "0 cravings",
        asiScore: "0 - 4 (higher score indicates more severity)",
    };

    if (loading) {
        return <div>Loading progress data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!progress || progress.length === 0) {
        return <div>No progress data found.</div>;
    }

    return (
        <div style={pageStyle}>
            <h1>Progress Details</h1>
            <Paper elevation={0}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="progress table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Height (m)</TableCell>
                                <TableCell>Weight (kg)</TableCell>
                                <TableCell>BMI</TableCell>
                                <TableCell>ASI Score</TableCell>
                                <TableCell>ASI Category</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {progress.map((record, index) => (
                                <TableRow key={record._id || index}>
                                    <TableCell>
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{record.height}</TableCell>
                                    <TableCell>{record.weight}</TableCell>
                                    <TableCell>{record.bmi?.toFixed(2)}</TableCell>
                                    <TableCell>{record.asiScore}</TableCell>
                                    <TableCell>{record.asiCategory}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleViewDetails(record._id)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* This button navigates back to the previous progress page */}
            <Button onClick={() => navigate(`/progress/${patientId}`)} style={backButtonStyle}>
                Back to Progress Page
            </Button>

            {/* Dialog for viewing details */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Progress Detail</DialogTitle>
                <DialogContent dividers>
                    {selectedProgress ? (
                        <Box>
                            {/* Group the details into sections */}
                            <Typography variant="h6" gutterBottom style={sectionTitleStyle}>
                                Basic Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("height")} style={clickableStyle}>
                                        <strong>Height: </strong>{selectedProgress.height} m
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("weight")} style={clickableStyle}>
                                        <strong>Weight: </strong>{selectedProgress.weight} kg
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("bmi")} style={clickableStyle}>
                                        <strong>BMI: </strong>{selectedProgress.bmi?.toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider style={dividerStyle} />

                            <Typography variant="h6" gutterBottom style={sectionTitleStyle}>
                                Vital Signs
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("bloodPressure")} style={clickableStyle}>
                                        <strong>Blood Pressure: </strong>{selectedProgress.bloodPressure}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("heartRate")} style={clickableStyle}>
                                        <strong>Heart Rate: </strong>{selectedProgress.heartRate} bpm
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("respiratoryRate")} style={clickableStyle}>
                                        <strong>Respiratory Rate: </strong>{selectedProgress.respiratoryRate} breaths/min
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("spo2")} style={clickableStyle}>
                                        <strong>SpO2: </strong>{selectedProgress.spo2} %
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider style={dividerStyle} />

                            <Typography variant="h6" gutterBottom style={sectionTitleStyle}>
                                Lab Results
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("bloodglucose")} style={clickableStyle}>
                                        <strong>Blood Glucose: </strong>{selectedProgress.bloodglucose} mg/dL
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("CBC")} style={clickableStyle}>
                                        <strong>CBC: </strong>{selectedProgress.CBC}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("ALT")} style={clickableStyle}>
                                        <strong>ALT: </strong>{selectedProgress.ALT}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("AST")} style={clickableStyle}>
                                        <strong>AST: </strong>{selectedProgress.AST}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("ALP")} style={clickableStyle}>
                                        <strong>ALP: </strong>{selectedProgress.ALP}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("serumCreatinine")} style={clickableStyle}>
                                        <strong>Serum Creatinine: </strong>{selectedProgress.serumCreatinine}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("urinalysis")} style={clickableStyle}>
                                        <strong>Urinalysis: </strong>{selectedProgress.urinalysis}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider style={dividerStyle} />

                            <Typography variant="h6" gutterBottom style={sectionTitleStyle}>
                                Addiction Data
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("frequencyOfUse")} style={clickableStyle}>
                                        <strong>Frequency of Use: </strong>{selectedProgress.frequencyOfUse} times
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("quantityOfUse")} style={clickableStyle}>
                                        <strong>Quantity of Use: </strong>{selectedProgress.quantityOfUse} units
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("numberOfCravings")} style={clickableStyle}>
                                        <strong>Number of Cravings: </strong>{selectedProgress.numberOfCravings}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" onClick={() => handleOpenRangeDialog("asiScore")} style={clickableStyle}>
                                        <strong>ASI Score: </strong>{selectedProgress.asiScore}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <div>Loading...</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for normal range details */}
            <Dialog open={rangeDialogOpen} onClose={handleCloseRangeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Normal Range for {selectedMeasure}</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1">
                        {normalRanges[selectedMeasure]}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRangeDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const pageStyle = {
    textAlign: "center",
    margin: "20px",
};

const backButtonStyle = {
    marginTop: "20px",
};

const sectionTitleStyle = {
    marginTop: "20px",
    color: "#000", // Black for section headers
    fontWeight: "bold", // Make it bold
};

const dividerStyle = {
    margin: "20px 0",
};

const clickableStyle = {
    cursor: "pointer",
    color: "#1976d2", // Make the clickable text stand out
};

export default ViewProgress;
