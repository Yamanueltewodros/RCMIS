import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const AddAppointment = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [commonSessions, setCommonSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPatients();
    }, []);

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

            if (professionalResponse && professionalResponse.data && professionalResponse.data.professional && professionalResponse.data.professional.length > 0) {
                const professional = professionalResponse.data.professional[0];
                const response = await axios.get(
                    `http://localhost:5000/api/professionals/get-patients-of-professional/${professional._id}`
                );
                setPatients(response.data || []);
            } else {
                console.error("No valid professional data available:", professionalResponse);
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
            const response = await axios.get(`http://localhost:5000/api/appointment/common-sessions/${professional._id}/${patientId}`);
            setCommonSessions([
                ...response.data.commonAvailableSessionsCurrentWeek,
                ...response.data.commonAvailableSessionsNextWeek
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
            const [professionalSessionId, patientSessionId] = selectedSession.split("|");
            const professionalResponse = await currentProfessional();
            const professional = professionalResponse.data.professional[0];
            await axios.post("http://localhost:5000/api/appointment/add-isolated-appointment", {
                patientSessionId,
                professionalSessionId,
                patientId: selectedPatient,
                professionalId: professional._id
            });
            alert("Appointment added successfully!");
            // Reset form
            setSelectedPatient("");
            setSelectedSession("");
            setCommonSessions([]);
        } catch (err) {
            setError("Failed to add appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attach-detach-container">
            <h1 className="patient-name">Add Appointment</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {/* <div className="form-group">
                  <label htmlFor="patient">Select Patient:</label>
                    <select
                        id="patient"
                        value={selectedPatient}
                        onChange={handlePatientChange}
                        disabled={loading}
                    >
                        <option value="" disabled>Select a patient</option>
                        {patients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.user.name}
                            </option>
                        ))}
                    </select>
                </div> */}

                 {/* <div className="form-group"> 
                    <label htmlFor="session">Select Available Session:</label>
                    <select
                        id="session"
                        value={selectedSession}
                        onChange={handleSessionChange}
                        disabled={loading || !selectedPatient}
                    >
                        <option value="" disabled>Select a session</option>
                        {commonSessions.map((session) => (
                            <option
                                key={`${session.professional._id}|${session.patient._id}`}
                                value={`${session.professional._id}|${session.patient._id}`}
                            >
                                {new Date(session.professional.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} - {session.professional.sessionNumber}
                                 {console.log(session.professional.date)} *
                            </option>
                        ))}
                    </select>
                </div> */}  
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
                   disabled={loading} 
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
               required
             
              sx={{paddingRight:"10px"}}
                >
                <InputLabel>Select Available Session</InputLabel>
                <Select
                  name="Session"
                  id="session"
                  value={selectedSession}
                  onChange={handleSessionChange}
                  disabled={loading || !selectedPatient}
                  >
                  <MenuItem value="" disabled>Select a session</MenuItem>
                  {commonSessions.map((session) => (
                            <MenuItem
                                key={`${session.professional._id}|${session.patient._id}`}
                                value={`${session.professional._id}|${session.patient._id}`}
                            >
                                {new Date(session.professional.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} - {session.professional.sessionNumber}
                                {/* {console.log(session.professional.date)} */}
                            </MenuItem>
                            ))}
                </Select>
              </FormControl>

             
                <button type="submit" disabled={loading || !selectedPatient || !selectedSession}>
                    Add Appointment
                </button>
            </form>
        </div>
    );
};

export default AddAppointment;
