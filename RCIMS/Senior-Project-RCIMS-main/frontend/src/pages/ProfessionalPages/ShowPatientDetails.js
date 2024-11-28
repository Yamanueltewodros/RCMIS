import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/AttachPatient.css";
import "./ProfessionalStyles/ShowPatientDetails.css";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ShowHistory from "./showhistory"; // Import the ShowHistory component
import AddPatientHistory from "./AddPatientHistory"; // Import the AddPatientHistory component
import PatientProgress from "./progress/progress"; // Import the PatientProgress component
import Prediction from "./Predictions"; // Import the Prediction component

const ShowPatientDetails = ({ patientId, onGoBack, fetchPatients }) => {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentProfessionalId, setCurrentProfessionalId] = useState("");
    const [showHistory, setShowHistory] = useState(false); // Track if we should show the history page
    const [addHistory, setAddHistory] = useState(false); // Track if we should navigate to AddPatientHistory page
    const [showProgress, setShowProgress] = useState(false); // Track if we should navigate to PatientProgress page
    const [showPrediction, setShowPrediction] = useState(false); // Track if we should navigate to Prediction page
    const [message, setMessage] = useState("");

    // Fetch the current professional's ID when the component mounts
    useEffect(() => {
        const fetchCurrentProfessional = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const response = await axios.get(
                    `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
                );
                if (response.data && response.data.professional && response.data.professional.length > 0) {
                    setCurrentProfessionalId(response.data.professional[0]._id); // Set the professional ID
                } else {
                    console.error("No professional data found for this user.");
                }
            } catch (error) {
                console.error("Error fetching current professional:", error);
                setError("Error fetching current professional.");
            }
        };

        fetchCurrentProfessional();
    }, []);

    // Fetch patient details by patientId
    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/patients/get-patients`);
                const foundPatient = response.data.find((p) => p._id === patientId); // Find the patient by ID
                setPatient(foundPatient);
                setLoading(false); // Stop loading after data is fetched
            } catch (error) {
                setError("Error fetching patient details.");
                console.error(error);
                setLoading(false); // Stop loading in case of error
            }
        };

        if (patientId) {
            fetchPatientDetails();
        }
    }, [patientId]);

    const handleDetachPatient = async () => {
        const confirmDetach = window.confirm("Are you sure you want to detach this patient?");
        if (!confirmDetach) return;

        try {
            if (!currentProfessionalId || !patientId) {
                alert("Professional ID or Patient ID is missing.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/professionals/detach-patient-from-professional", {
                professionalId: currentProfessionalId,
                patientId,
            });

            alert(response.data.message); // Use the message from the API response
            fetchPatients(); // Refresh the patient list after detaching
            onGoBack(); // Navigate back to the list of patients
        } catch (error) {
            console.error("Error detaching patient:", error.response ? error.response.data : error);
            const errorMessage = error.response?.data?.message || "Error detaching patient. Please try again.";
            alert(errorMessage); // Use the error message from the API or a default message
        }
    };

    // If showHistory is true, display the ShowHistory component
    if (showHistory) {
        return <ShowHistory patientId={patientId} onGoBack={() => setShowHistory(false)} />; // Pass onGoBack to return to this page
    }

    // If addHistory is true, display the AddPatientHistory component
    if (addHistory) {
        return <AddPatientHistory patientId={patientId} onGoBack={() => setAddHistory(false)} />; // Pass onGoBack to return to this page
    }

    // If showProgress is true, display the PatientProgress component
    if (showProgress) {
        return <PatientProgress patientId={patientId} onGoBack={() => setShowProgress(false)} />; // Pass onGoBack to return to this page
    }

    // If showPrediction is true, display the Prediction component
    if (showPrediction) {
        return <Prediction patientId={patientId} onGoBack={() => setShowPrediction(false)} />; // Pass onGoBack to return to this page
    }

    return (
        <div className="show-patient-details">
            {patient ? (
                <div className="detail-container">
                    <div className="header">
                        <ArrowBackIcon className=".back-button" onClick={onGoBack} />
                        <h3 className="patient-name">{`${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`}</h3>
                    </div>
                    <div className="container">
                        <div className="column1">
                            <div className="detail-item">
                                <p>Phone Number</p>
                                <strong>{patient.user?.phoneNumber}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Address</p>
                                <strong>{patient.user?.address}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Room Number</p>
                                <strong>{patient.roomNumber || "N/A"}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Bed Number</p>
                                <strong>{patient.bedNumber || "N/A"}</strong>
                            </div>
                            <div className="icons-section">
                                <div className="icon-item">
                                    <button className="CareGiver-button" onClick={() => setShowHistory(true)}>
                                        View History
                                    </button>
                                </div>
                                <div className="icon-item">
                                    <button className="CareGiver-button" onClick={() => setShowProgress(true)}>
                                        Progress
                                    </button>
                                </div>
                                <div className="icon-item">
                                    <button className="CareGiver-button" onClick={() => setShowPrediction(true)}>
                                        Prediction
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column2">
                            <div className="detail-item">
                                <p>Employment Status</p>
                                <strong>{patient.employmentStatus}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Educational Level</p>
                                <strong>{patient.educationalLevel}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Living Situation</p>
                                <strong>{patient.livingSituation}</strong>
                            </div>
                            <div className="detail-item">
                                <p>Allergies</p>
                                <strong>{patient.allergies || "None"}</strong>
                            </div>
                            <div className="action-buttons">
                                <div className="icon-item">
                                    <button className="CareGiver-button" onClick={() => setAddHistory(true)}>
                                        Add History
                                    </button>
                                </div>
                                <div className="icon-item">
                                    <button className="CareGiver-button" onClick={handleDetachPatient}>
                                        Detach Patient
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No patient details found.</p>
            )}
        </div>
    );
};

export default ShowPatientDetails;
