import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditAppointment = ({ appointmentId, onGoBack }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [commonSessions, setCommonSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [appointmentUpdated, setAppointmentUpdated] = useState(false);

    useEffect(() => {
        fetchAppointmentDetails();
        fetchPatients();
    }, [appointmentId]);

    useEffect(() => {
        if (selectedPatient) {
            fetchCommonSessions(selectedPatient);
        }
    }, [selectedPatient]);

    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/api/appointment/appointment-details/${appointmentId}`
            );
            setAppointmentDetails(response.data.appointment);
            setSelectedPatient(response.data.appointment.patientId);
            setSelectedSession(
                `${response.data.appointment.professionalSessionId}|${response.data.appointment.patientSessionId}`
            );
            await fetchCommonSessions(response.data.appointment.patientId);
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            setError("Failed to fetch appointment details");
        } finally {
            setLoading(false);
        }
    };

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

    const fetchPatients = async () => {
        try {
            setLoading(true);
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
                setPatients(response.data || []);
            } else {
                console.error(
                    "No valid professional data available:",
                    professionalResponse
                );
                setPatients([]);
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            setError("Failed to fetch patients");
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommonSessions = async (patientId) => {
        try {
            setLoading(true);
            const professionalResponse = await currentProfessional();
            const professional = professionalResponse.data.professional[0];
            const response = await axios.get(
                `http://localhost:5000/api/appointment/common-sessions/${professional._id}/${patientId}`
            );
            setCommonSessions([
                ...response.data.commonAvailableSessionsCurrentWeek,
                ...response.data.commonAvailableSessionsNextWeek,
            ]);
        } catch (err) {
            setError("Failed to fetch common sessions");
        } finally {
            setLoading(false);
        }
    };

    const handlePatientChange = (e) => {
        const patientId = e.target.value;
        setSelectedPatient(patientId);
        if (patientId) {
            fetchCommonSessions(patientId);
        } else {
            setCommonSessions([]);
        }
        setSelectedSession("");
    };

    const handleSessionChange = (e) => {
        setSelectedSession(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient || !selectedSession) {
            setError("Please select both a patient and a session");
            return;
        }

        try {
            setLoading(true);
            const [professionalSessionId, patientSessionId] =
                selectedSession.split("|");
            const professionalResponse = await currentProfessional();
            const professional = professionalResponse.data.professional[0];

            // Log the data being sent
            console.log("Sending data:", {
                patientId: selectedPatient,
                professionalId: professional._id,
                patientSessionId,
                professionalSessionId,
            });

            const response = await axios.put(
                `http://localhost:5000/api/appointment/edit-appointment/${appointmentId}`,
                {
                    patientId: selectedPatient,
                    professionalId: professional._id,
                    patientSessionId,
                    professionalSessionId,
                }
            );

            console.log("Response:", response.data);
            setAppointmentUpdated(true);
            alert("Appointment updated successfully!");
        } catch (err) {
            console.error(
                "Error updating appointment:",
                err.response ? err.response.data : err.message
            );
            setError(
                "Failed to update appointment: " +
                    (err.response ? err.response.data.message : err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        onGoBack(appointmentUpdated);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="attach-detach-container">
            
            <div class="header">
                <ArrowBackIcon  onClick={onGoBack}/>
                <h1 className="patient-name">Edit Appointment</h1>
            </div>
            <form onSubmit={handleSubmit}>
            <FormControl 
              fullWidth  
              sx={{paddingRight:"10px"}}
                required>
                <InputLabel>Patient</InputLabel>
                <Select
                  name="patient"
                   id="patient"
                   value={selectedPatient}
                   onChange={handlePatientChange}
                   disabled={true} 
                  >
                  <MenuItem value="" disabled>Select a patient</MenuItem>
                  {patients.map((patient) => (
                            <MenuItem key={patient._id} value={patient._id}>
                                {patient.user.name}
                            </MenuItem>
                            ))}
                </Select>
              </FormControl> 
              <FormControl 
              fullWidth  
              sx={{paddingRight:"10px"}}
                required>
                <InputLabel>Session</InputLabel>
                <Select
                  name="SelectSession"
                  id="session"
                  value={selectedSession}
                  onChange={handleSessionChange}
                  disabled={loading || !selectedPatient} 
                  >
                  <MenuItem value="" disabled>Select a patient</MenuItem>
                  {commonSessions.map((session) => (
                            <MenuItem
                                key={`${session.professional._id}|${session.patient._id}`}
                                value={`${session.professional._id}|${session.patient._id}`}
                            >
                                {new Date(
                                    session.professional.date
                                ).toLocaleString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    timeZone: "UTC",
                                })}{" "}
                                - {session.professional.sessionNumber}
                            </MenuItem>
                        ))}
                </Select>
              </FormControl>   
{/* 
                <div>
                    <label htmlFor="patient">Patient:</label>
                    <select
                        id="patient"
                        value={selectedPatient}
                        onChange={handlePatientChange}
                        disabled={true} // Always disabled when editing
                     >
                        <option value="" disabled>
                            Select a patient
                        </option>
                        {patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.user.name}
                            </option>
                        ))}
                    </select>
                </div> */}
                {/* <div>
                    <label htmlFor="session">Select Available Session:</label>
                    <select
                        id="session"
                        value={selectedSession}
                        onChange={handleSessionChange}
                        disabled={loading || !selectedPatient}
                    >
                        <option value="" disabled>
                            Select a session
                        </option>
                        {commonSessions.map((session) => (
                            <option
                                key={`${session.professional._id}|${session.patient._id}`}
                                value={`${session.professional._id}|${session.patient._id}`}
                            >
                                {new Date(
                                    session.professional.date
                                ).toLocaleString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    timeZone: "UTC",
                                })}{" "}
                                - {session.professional.sessionNumber}
                            </option>
                        ))}
                    </select>
                </div> */}
                <Box  sx={{display: "flex", width:"100%"}}>
                    <button
                       fullWidth
                        type="submit"
                        disabled={
                            loading || !selectedPatient || !selectedSession
                        }
                    >
                        Update Appointment
                    </button>
                    {/* <button fullWidth type="button" onClick={handleGoBack}>
                        Back
                    </button> */}
                </Box>
            </form>
        </div>
    );
};

export default EditAppointment;
