import React, { useState } from 'react';
import axios from 'axios';
import '../../Styling/AdminPageStyles/AddAppointments.css';

function AddPatient() {
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        grandfatherName: '',
        phoneNumber: '',
        password: '',
        role: 'patient',
        dateOfBirth: '',
        gender: '',
        address: '',
        employmentStatus: '',
        educationalLevel: '',
        livingSituation: '',
        patientType: '',
        roomNumber: '',
        bedNumber: '',
        allergies: '',
        currentMedicalConditions: '',
        primarySubstance: '',
        primarySubstanceMethodOfUse: '',
        secondarySubstances: '',
        pastAddictionTreatment: '',
        withdrawalSymptoms: '',
        socialSupportNetwork: '',
        historyOfTraumaOrAbuse: ''
    });

    const [errors, setErrors] = useState({});

    // Helper function to calculate age based on date of birth
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }
        return age;
    };

    // Validate the form fields
    const validateForm = () => {
        let formErrors = {};

        if (!formData.name) formErrors.name = "Name is required";
        if (!formData.fatherName) formErrors.fatherName = "Father's Name is required";
        if (!formData.grandfatherName) formErrors.grandfatherName = "Grandfather's Name is required";
        if (!formData.phoneNumber) formErrors.phoneNumber = "Phone Number is required";
        if (!formData.password) formErrors.password = "Password is required";
        if (!formData.gender) formErrors.gender = "Gender is required";
        if (!formData.dateOfBirth) {
            formErrors.dateOfBirth = "Date of Birth is required";
        } else {
            const age = calculateAge(formData.dateOfBirth);
            if (age < 18 || age > 120) {
                formErrors.dateOfBirth = "Age must be between 18 and 120 years";
            }
            if (new Date(formData.dateOfBirth).getFullYear() < 1900) {
                formErrors.dateOfBirth = "Date of birth cannot be before 1900";
            }
        }

        if (!formData.employmentStatus) formErrors.employmentStatus = "Employment status is required";
        if (!formData.patientType) formErrors.patientType = "Patient type is required";
        if (!formData.primarySubstance) formErrors.primarySubstance = "Primary substance is required";
        if (!formData.primarySubstanceMethodOfUse) formErrors.primarySubstanceMethodOfUse = "Method of use is required";
        if (!formData.pastAddictionTreatment) formErrors.pastAddictionTreatment = "Past addiction treatment is required";
        if (!formData.withdrawalSymptoms) formErrors.withdrawalSymptoms = "Withdrawal symptoms are required";
        if (!formData.socialSupportNetwork) formErrors.socialSupportNetwork = "Social support network is required";
        if (!formData.historyOfTraumaOrAbuse) formErrors.historyOfTraumaOrAbuse = "History of trauma or abuse is required";

        return formErrors;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/patients/add-patient', formData);
            alert("Patient added successfully!");
            setFormData({
                name: '',
                fatherName: '',
                grandfatherName: '',
                phoneNumber: '',
                password: '',
                role: 'patient',
                dateOfBirth: '',
                gender: '',
                address: '',
                employmentStatus: '',
                educationalLevel: '',
                livingSituation: '',
                patientType: '',
                roomNumber: '',
                bedNumber: '',
                allergies: '',
                currentMedicalConditions: '',
                primarySubstance: '',
                primarySubstanceMethodOfUse: '',
                secondarySubstances: '',
                pastAddictionTreatment: '',
                withdrawalSymptoms: '',
                socialSupportNetwork: '',
                historyOfTraumaOrAbuse: ''
            });
            setErrors({});
        } catch (error) {
            console.error("Error adding patient:", error.response || error.message);
            alert("An error occurred while submitting the form.");
        }
    };

    return (
        <div>
            <h2>Add New Patient</h2>
            <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                {/* Father Name */}
                <div className="form-group">
                    <label htmlFor="fatherName">Father's Name *</label>
                    <input
                        type="text"
                        id="fatherName"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                    />
                    {errors.fatherName && <span className="error">{errors.fatherName}</span>}
                </div>

                {/* Grandfather Name */}
                <div className="form-group">
                    <label htmlFor="grandfatherName">Grandfather's Name *</label>
                    <input
                        type="text"
                        id="grandfatherName"
                        name="grandfatherName"
                        value={formData.grandfatherName}
                        onChange={handleChange}
                    />
                    {errors.grandfatherName && <span className="error">{errors.grandfatherName}</span>}
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                    {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                </div>

                {/* Gender */}
                <div className="form-group">
                    <label htmlFor="gender">Gender *</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <span className="error">{errors.gender}</span>}
                </div>

                {/* Employment Status */}
                <div className="form-group">
                    <label htmlFor="employmentStatus">Employment Status *</label>
                    <input
                        type="text"
                        id="employmentStatus"
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleChange}
                    />
                    {errors.employmentStatus && <span className="error">{errors.employmentStatus}</span>}
                </div>

                {/* Additional fields can be added similarly for other inputs */}

                <button type="submit">Add Patient</button>
            </form>
        </div>
    );
}

export default AddPatient;
