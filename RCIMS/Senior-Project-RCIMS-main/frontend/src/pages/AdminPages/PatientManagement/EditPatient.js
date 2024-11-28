import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../Styling/AdminPageStyles/EditPatient.css";

function EditPatient({ patientId }) {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    grandfatherName: '',
    phoneNumber: '',
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
    historyOfTraumaOrAbuse: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch patient data on load
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/get-patient/${patientId}`);
        const patientData = response.data.patient;
        setFormData({
          name: patientData.user.name,
          fatherName: patientData.user.fatherName,
          grandfatherName: patientData.user.grandfatherName,
          phoneNumber: patientData.user.phoneNumber,
          dateOfBirth: patientData.user.dateOfBirth,
          gender: patientData.user.gender,
          address: patientData.user.address,
          employmentStatus: patientData.employmentStatus,
          educationalLevel: patientData.educationalLevel,
          livingSituation: patientData.livingSituation,
          patientType: patientData.patientType,
          roomNumber: patientData.roomNumber || '',
          bedNumber: patientData.bedNumber || '',
          allergies: patientData.allergies.join(', ') || '',
          currentMedicalConditions: patientData.currentMedicalConditions.join(', ') || '',
          primarySubstance: patientData.primarySubstance,
          primarySubstanceMethodOfUse: patientData.primarySubstanceMethodOfUse,
          secondarySubstances: patientData.secondarySubstances.join(', ') || '',
          pastAddictionTreatment: patientData.pastAddictionTreatment,
          withdrawalSymptoms: patientData.withdrawalSymptoms,
          socialSupportNetwork: patientData.socialSupportNetwork,
          historyOfTraumaOrAbuse: patientData.historyOfTraumaOrAbuse,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const validatePhoneNumber = (number) => {
    const phonePattern = /^0[79][0-9]{8}$/;
    return phonePattern.test(number);
  };

  const validateDateOfBirth = (dob) => {
    const date = new Date(dob);
    const currentYear = new Date().getFullYear();
    const birthYear = date.getFullYear();
    return birthYear >= 1900 && currentYear - birthYear >= 18 && currentYear - birthYear <= 100;
  };

  const validateForm = () => {
    let formErrors = {};

    if (page === 1) {
      if (!formData.name) formErrors.name = "Name is required";
      if (!formData.fatherName) formErrors.fatherName = "Father's Name is required";
      if (!formData.grandfatherName) formErrors.grandfatherName = "Grandfather's Name is required";
      if (!formData.phoneNumber) formErrors.phoneNumber = "Phone Number is required";
      if (!formData.dateOfBirth) formErrors.dateOfBirth = "Date of Birth is required";
      if (!formData.gender) formErrors.gender = "Gender is required";
      if (!formData.address) formErrors.address = "Address is required";

      if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
        formErrors.phoneNumber = "Phone number must start with 0, followed by 7 or 9, and be 10 digits long.";
      }
      if (formData.dateOfBirth && !validateDateOfBirth(formData.dateOfBirth)) {
        formErrors.dateOfBirth = "Date of birth must be between 1900 and the current year, and the patient must be between 18 and 100 years old.";
      }
    } else if (page === 2) {
      if (!formData.employmentStatus) formErrors.employmentStatus = "Employment Status is required";
      if (!formData.educationalLevel) formErrors.educationalLevel = "Educational Level is required";
      if (!formData.livingSituation) formErrors.livingSituation = "Living Situation is required";
      if (!formData.patientType) formErrors.patientType = "Patient Type is required";
    } else if (page === 3) {
      if (!formData.primarySubstance) formErrors.primarySubstance = "Primary Substance is required";
      if (!formData.primarySubstanceMethodOfUse) formErrors.primarySubstanceMethodOfUse = "Primary Substance Method Of Use is required";
      if (!formData.pastAddictionTreatment) formErrors.pastAddictionTreatment = "Past Addiction Treatment is required";
      if (!formData.withdrawalSymptoms) formErrors.withdrawalSymptoms = "Withdrawal Symptoms is required";
      if (!formData.socialSupportNetwork) formErrors.socialSupportNetwork = "Social Support Network is required";
      if (!formData.historyOfTraumaOrAbuse) formErrors.historyOfTraumaOrAbuse = "History of Trauma or Abuse is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/patients/update-patient/${editFormData._id}`,
        editFormData
    );
      
      alert('Patient updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      alert("An error occurred while updating the patient.");
    }
  };

  const renderPageContent = () => {
    switch (page) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label>Name<span className="required">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Father's Name<span className="required">*</span></label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
              {errors.fatherName && <span className="error-text">{errors.fatherName}</span>}
            </div>
            <div className="form-group">
              <label>Grandfather's Name<span className="required">*</span></label>
              <input type="text" name="grandfatherName" value={formData.grandfatherName} onChange={handleChange} />
              {errors.grandfatherName && <span className="error-text">{errors.grandfatherName}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number<span className="required">*</span></label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>
            <div className="form-group">
              <label>Date of Birth<span className="required">*</span></label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </div>
            <div className="form-group">
              <label>Gender<span className="required">*</span></label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>
            <div className="form-group">
              <label>Address<span className="required">*</span></label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label>Employment Status<span className="required">*</span></label>
              <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange}>
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
              {errors.employmentStatus && <span className="error-text">{errors.employmentStatus}</span>}
            </div>
            <div className="form-group">
              <label>Educational Level<span className="required">*</span></label>
              <input type="text" name="educationalLevel" value={formData.educationalLevel} onChange={handleChange} />
              {errors.educationalLevel && <span className="error-text">{errors.educationalLevel}</span>}
            </div>
            <div className="form-group">
              <label>Living Situation<span className="required">*</span></label>
              <select name="livingSituation" value={formData.livingSituation} onChange={handleChange}>
                <option value="">Select situation</option>
                <option value="Alone">Alone</option>
                <option value="With Family">With Family</option>
                <option value="With Partner">With Partner</option>
              </select>
              {errors.livingSituation && <span className="error-text">{errors.livingSituation}</span>}
            </div>
            <div className="form-group">
              <label>Patient Type<span className="required">*</span></label>
              <select name="patientType" value={formData.patientType} onChange={handleChange}>
                <option value="">Select type</option>
                <option value="In-patient">In-patient</option>
                <option value="Out-patient">Out-patient</option>
              </select>
              {errors.patientType && <span className="error-text">{errors.patientType}</span>}
            </div>
            {formData.patientType === "In-patient" && (
              <>
                <div className="form-group">
                  <label>Room Number</label>
                  <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bed Number</label>
                  <input type="text" name="bedNumber" value={formData.bedNumber} onChange={handleChange} />
                </div>
              </>
            )}
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group">
              <label>Primary Substance<span className="required">*</span></label>
              <input type="text" name="primarySubstance" value={formData.primarySubstance} onChange={handleChange} />
              {errors.primarySubstance && <span className="error-text">{errors.primarySubstance}</span>}
            </div>
            <div className="form-group">
              <label>Primary Substance Method Of Use<span className="required">*</span></label>
              <select name="primarySubstanceMethodOfUse" value={formData.primarySubstanceMethodOfUse} onChange={handleChange}>
                <option value="">Select method</option>
                <option value="Oral">Oral</option>
                <option value="Injection">Injection</option>
                <option value="Inhalation">Inhalation</option>
              </select>
              {errors.primarySubstanceMethodOfUse && <span className="error-text">{errors.primarySubstanceMethodOfUse}</span>}
            </div>
            <div className="form-group">
              <label>Secondary Substances</label>
              <input type="text" name="secondarySubstances" value={formData.secondarySubstances} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Past Addiction Treatment<span className="required">*</span></label>
              <select name="pastAddictionTreatment" value={formData.pastAddictionTreatment} onChange={handleChange}>
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.pastAddictionTreatment && <span className="error-text">{errors.pastAddictionTreatment}</span>}
            </div>
            <div className="form-group">
              <label>Withdrawal Symptoms<span className="required">*</span></label>
              <select name="withdrawalSymptoms" value={formData.withdrawalSymptoms} onChange={handleChange}>
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.withdrawalSymptoms && <span className="error-text">{errors.withdrawalSymptoms}</span>}
            </div>
            <div className="form-group">
              <label>Social Support Network<span className="required">*</span></label>
              <select name="socialSupportNetwork" value={formData.socialSupportNetwork} onChange={handleChange}>
                <option value="">Select option</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Support Group">Support Group</option>
              </select>
              {errors.socialSupportNetwork && <span className="error-text">{errors.socialSupportNetwork}</span>}
            </div>
            <div className="form-group">
              <label>History of Trauma or Abuse<span className="required">*</span></label>
              <select name="historyOfTraumaOrAbuse" value={formData.historyOfTraumaOrAbuse} onChange={handleChange}>
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Unknown">Unknown</option>
              </select>
              {errors.historyOfTraumaOrAbuse && <span className="error-text">{errors.historyOfTraumaOrAbuse}</span>}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <p>Loading patient data...</p>;
  }

  return (
    <div className="edit-patient-container">
      <h1>Edit Patient</h1>
      <form onSubmit={handleSubmit}>
        {renderPageContent()}

        <div className="navigation-buttons">
          {page > 1 && (
            <button type="button" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          )}
          {page < 3 && (
            <button type="button" onClick={() => {
              if (validateForm()) setPage(page + 1);
            }}>
              Next
            </button>
          )}
          {page === 3 && (
            <button type="submit">Update Patient</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditPatient;
