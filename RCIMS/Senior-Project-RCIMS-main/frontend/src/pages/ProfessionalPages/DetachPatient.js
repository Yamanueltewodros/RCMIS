import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/DetachPatient.css";

const DetachPatient = ({ onGoBack }) => {
    const [professionals, setProfessionals] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState("");
    const [selectedPatient, setSelectedPatient] = useState("");
    const [message, setMessage] = useState("");
    const [currentDepartment, setCurrentDepartment] = useState(""); // To store the department of the logged-in user

    // Fetch professionals and patients when the component mounts
    useEffect(() => {
        fetchProfessionals();
        fetchPatients();
    }, []);

    // Fetch current logged-in professional based on stored user info
    const currentProfessional = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            // Get professional by the current logged-in user's ID
            const response = await axios.get(
                `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
            );
            setCurrentDepartment(response.data.professional[0].department);
            return response;
        } catch (error) {
            console.error("Error fetching current professional:", error);
            throw error;
        }
    };

    // Fetch all professionals
    const fetchProfessionals = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/professionals/get-professionals"
            );
            setProfessionals(response.data.professionals || []); // Adjust the key based on your API response
        } catch (error) {
            console.error("Error fetching professionals:", error);
        }
    };

    // Fetch patients assigned to the current professional
    const fetchPatients = async () => {
        try {
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
                setPatients(response.data || []); // Use an empty array if undefined
            } else {
                console.error(
                    "No valid professional data available:",
                    professionalResponse
                );
                setPatients([]); // Set to empty array if no professional data
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            setPatients([]); // Set to empty array on error
        }
    };

    // Handle detaching patient from professional
    const handleDetachPatient = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/professionals/removePatientFromProfessional",
                {
                    professionalId: selectedProfessional,
                    patientId: selectedPatient,
                }
            );
            setMessage(response.data.message);
            // Remove detached patient from the UI
            setPatients(patients.filter((p) => p._id !== selectedPatient));
        } catch (error) {
            console.error("Error detaching patient:", error);
            setMessage(
                "An error occurred while detaching the patient. Please try again."
            );
        }
    };

    return (
        <div className="attach-detach-container">
            {/* Back Button */}
            <button className="btn btn-back" onClick={onGoBack}>
                Back
            </button>

            <h2>Detach Patient from Professional</h2>

            {message && <p>{message}</p>}

            <form onSubmit={handleDetachPatient}>
                <label>Select Professional:</label>
                <select
                    value={selectedProfessional}
                    onChange={(e) => {
                        setSelectedProfessional(e.target.value);
                        fetchPatients(e.target.value); // Fetch patients when a professional is selected
                    }}
                    required
                >
                    <option value="">-- Select Professional --</option>
                    {professionals.map((professional) => (
                        <option key={professional._id} value={professional._id}>
                            {professional.user.name} ({professional.speciality})
                        </option>
                    ))}
                </select>

                <label>Select Patient:</label>
                <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    required
                >
                    <option value="">-- Select Patient --</option>
                    {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                            {patient.user.name}
                        </option>
                    ))}
                </select>

                <button type="submit">Detach Patient</button>
            </form>
        </div>
    );
};

export default DetachPatient;
