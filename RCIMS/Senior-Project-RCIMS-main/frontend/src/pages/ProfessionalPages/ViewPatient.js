import React, { useState } from "react";

const ViewPatient = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="view-patient-container">
      <h2>View Patients</h2>
      {selectedPatient ? (
        <div className="patient-details">
          <h3>{`${selectedPatient.user?.name} ${selectedPatient.user?.fatherName} ${selectedPatient.user?.grandfatherName}`}</h3>
          <p><strong>Phone:</strong> {selectedPatient.user?.phoneNumber}</p>
          <p><strong>Address:</strong> {selectedPatient.user?.address}</p>
          <p><strong>Patient Type:</strong> {selectedPatient.patientType}</p>
          <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
          <button onClick={() => setSelectedPatient(null)}>Back to List</button>
        </div>
      ) : (
        <div className="patient-list">
          <ul>
            {patients.map((patient) => (
              <li key={patient._id}>
                <p>{`${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`}</p>
                <button onClick={() => handleViewDetails(patient)}>View Details</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewPatient;
