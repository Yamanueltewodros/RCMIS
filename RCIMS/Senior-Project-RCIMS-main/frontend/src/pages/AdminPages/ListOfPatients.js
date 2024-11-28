import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styling/AdminPageStyles/ListOfPatients.css";
import EditPatient from "./EditPatient"; // Import your EditPatient component

const ListOfPatients = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState({ patientType: "", gender: "" });
    const [error, setError] = useState(null);

    // Fetch patients on component mount and when filters change
    useEffect(() => {
        fetchPatients();
    }, [searchTerm, filter]);

    const fetchPatients = async () => {
        try {
            console.log("Fetching patients with parameters:", { searchTerm, ...filter });
            
            const response = await axios.get("http://localhost:5000/api/patients/get-patients", {
                params: {
                    search: searchTerm,
                    patientType: filter.patientType,
                    gender: filter.gender,
                },
            });

            console.log("Response received:", response.data);

            setPatients(response.data.patients || response.data);

        } catch (error) {
            console.error("Error fetching patients:", error);
            setError(`Failed to fetch patients. ${error.message}`);
        }
    };

    const handleDetails = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/patients/get-patient-information/${patientId}`);
            console.log("Patient details received:", response.data);
            setSelectedPatient(response.data.patient);
            setIsEditing(false);
        } catch (error) {
            console.error("Error fetching patient details:", error);
            setError(`Failed to fetch patient details. ${error.message}`);
        }
    };

    const handleBackToList = () => {
        setSelectedPatient(null);
        setIsEditing(false);
    };

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setEditFormData({
            _id: patient._id,
            name: patient.user?.name || "",
            fatherName: patient.user?.fatherName || "",
            grandfatherName: patient.user?.grandfatherName || "",
            phoneNumber: patient.user?.phoneNumber || "",
            address: patient.user?.address || "",
            dateOfBirth: patient.user?.dateOfBirth
                ? new Date(patient.user.dateOfBirth).toISOString().split("T")[0]
                : "",
            gender: patient.user?.gender || "",
            patientType: patient.patientType || "",
            allergies: patient.allergies || "",
            status: patient.status || "",
        });
        setIsEditing(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/patients/update-patient/${editFormData._id}`,
                editFormData
            );
            if (response.status === 200) {
                alert("Patient updated successfully");
                fetchPatients();
                setIsEditing(false);
                handleDetails(response.data.patient._id);
            }
        } catch (error) {
            console.error("Error updating patient:", error);
            setError(`Failed to update patient. ${error.message}`);
        }
    };

    const handleRemove = async (patientId) => {
        const isConfirmed = window.confirm("Are you sure you want to remove this patient?");
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/patients/delete-patient/${patientId}`);
                alert("Patient removed successfully");
                setSelectedPatient(null);
                fetchPatients();
            } catch (error) {
                console.error("Error removing patient:", error);
                setError(`Failed to remove patient. ${error.message}`);
            }
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="patients-list-container">
            {selectedPatient ? (
                isEditing ? (
                    <EditPatient
                        patient={editFormData}
                        handleEditFormChange={handleEditFormChange}
                        handleEditSubmit={handleEditSubmit}
                        setIsEditing={setIsEditing}
                    />
                ) : (
                    <div className="patient-details">
                        <h2>Patient Details</h2>
                        <button className="back-button" onClick={handleBackToList}>Back to List</button>
                        <h3>{`${selectedPatient.user?.name} ${selectedPatient.user?.fatherName} ${selectedPatient.user?.grandfatherName}`}</h3>
                        <p><strong>Phone:</strong> {selectedPatient.user?.phoneNumber}</p>
                        <p><strong>Address:</strong> {selectedPatient.user?.address}</p>
                        <p><strong>Patient Type:</strong> {selectedPatient.patientType}</p>
                        <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
                        <button className="btn btn-edit" onClick={() => handleEdit(selectedPatient)}>Edit</button>
                        <button className="btn btn-remove" onClick={() => handleRemove(selectedPatient._id)}>Remove</button>
                    </div>
                )
            ) : (
                <div>
                    <h1>Patient List</h1>
                    {/* Search and Filter Section */}
                    <div className="search-filter-section">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={filter.patientType}
                            onChange={(e) => setFilter({ ...filter, patientType: e.target.value })}
                        >
                            <option value="">All Patient Types</option>
                            <option value="In-patient">In-patient</option>
                            <option value="Out-patient">Out-patient</option>
                        </select>
                        <select
                            className="filter-select"
                            value={filter.gender}
                            onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
                        >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    {/* Patient List */}
                    <ul className="patients-list">
                        {patients.map((patient) => (
                            <li key={patient._id} className="patient-item">
                                <div className="patient-info">
                                    <h2>{`${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`}</h2>
                                    <p><strong>Phone Number:</strong> {patient.user?.phoneNumber}</p>
                                    <p><strong>Patient Type:</strong> {patient.patientType}</p>
                                </div>
                                <div className="patient-actions">
                                    <button className="btn btn-details" onClick={() => handleDetails(patient._id)}>
                                        Details
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ListOfPatients;
