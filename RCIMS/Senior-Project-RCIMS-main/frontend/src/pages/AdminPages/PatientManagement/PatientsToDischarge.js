import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PatientsToDischarge = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchPatientsToDischarge();
    }, []);

    const fetchPatientsToDischarge = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/patients/get-patients-to-discharge"
            );
            // Map the response data to match the expected structure if necessary
            const mappedPatients = response.data.patients.map(patient => ({
                _id: patient._id,
                name: patient.name || patient.user?.name,
                fatherName: patient.fatherName || patient.user?.fatherName,
                grandfatherName: patient.grandfatherName || patient.user?.grandfatherName,
                phoneNumber: patient.phoneNumber || patient.user?.phoneNumber,
                patientType: patient.patientType,
                // Add other fields as necessary
            }));
            setPatients(mappedPatients);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching patients to discharge:", error);
            setLoading(false);
        }
    };

    const handleDischarge = async (patientId) => {
        // Ask for confirmation
        const isConfirmed = window.confirm("Are you sure you want to discharge this patient?");
        
        if (isConfirmed) {
            try {
                await axios.put(
                    `http://localhost:5000/api/patients/discharge-patient/${patientId}`
                );
                fetchPatientsToDischarge(); // Refresh the list
            } catch (error) {
                console.error("Error discharging patient:", error);
            }
        }
    };

    const fetchPatientDetails = async (patientId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/patients/get-patient-information/${patientId}`
            );
            setSelectedPatient(response.data.patient);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    const handleBackToList = () => {
        setSelectedPatient(null);
    };

    const calculateAge = (selectedPatient) => {
        let dob = selectedPatient.user?.dateOfBirth;
        if (!dob) return "N/A";
        
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (selectedPatient) {
        return (
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4 }}>
                <div className="detail-container">
                    <div className="header">
                        <ArrowBackIcon className="back-button" onClick={handleBackToList} />
                        <h2 className="patient-name">{`${selectedPatient.user?.name} ${selectedPatient.user?.fatherName} ${selectedPatient.user?.grandfatherName}`}</h2>
                    </div>
                    <div className="container">
                        <div className="column1">
                            <div className="detail-item">
                                <p>Name</p>
                                <strong>{selectedPatient.user?.name}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Gender</p>
                                <strong>{selectedPatient.user?.gender}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Age</p>
                                <strong>{calculateAge(selectedPatient)}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Phone</p>
                                <strong>{selectedPatient.user?.phoneNumber}</strong>
                            </div>
                        </div>
                        <div className="column2">
                            <div className="detail-item">
                                <p>Patient Type</p>
                                <strong>{selectedPatient.patientType}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Admitted on</p>
                                <strong>{formatDate(selectedPatient.user?.createdAt)}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Allergies</p>
                                <strong>{selectedPatient.allergies}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Address</p>
                                <strong>{selectedPatient.user?.address}</strong>
                            </div>
                            <div className="action-buttons">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleDischarge(selectedPatient._id)}
                                >
                                    Discharge
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 4 }}>
            <div style={styles.header}>
                <Typography variant="h5" component="h2">
                    Patients Ready for Discharge
                </Typography>
            </div>

            <TableContainer>
                <Table
                    sx={{ minWidth: 650 }}
                    aria-label="patients to discharge table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Father's Name</TableCell>
                            <TableCell>Grand Father's Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Patient Type</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient, index) => (
                            <TableRow key={patient._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{patient.name || patient.user?.name}</TableCell>
                                <TableCell>{patient.fatherName || patient.user?.fatherName}</TableCell>
                                <TableCell>{ patient.grandfatherName || patient.user?.grandfatherName}</TableCell>
                                <TableCell>{patient.phoneNumber || patient.user?.phoneNumber}</TableCell>
                                <TableCell>{patient.patientType}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleDischarge(patient._id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Discharge
                                    </Button>
                                </TableCell>
                                <TableCell><MoreHorizIcon
                                        sx={{
                                            color: "#0891b2",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => fetchPatientDetails(patient._id)}
                                    /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {loading && <Typography>Loading...</Typography>}
            {!loading && patients.length === 0 && (
                <Typography sx={{ mt: 2, textAlign: "center" }}>
                    No patients ready for discharge.
                </Typography>
            )}
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

export default PatientsToDischarge;
