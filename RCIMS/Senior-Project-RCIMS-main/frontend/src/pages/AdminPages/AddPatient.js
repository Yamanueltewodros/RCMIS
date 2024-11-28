import React, { useState } from "react";
import axios from "axios";
import "../Styling/AdminPageStyles/AddPatient.css";

function AddPatientForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    grandfatherName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    employmentStatus: "",
    educationalLevel: "",
    livingSituation: "",
    patientType: "",
    roomNumber: "",
    bedNumber: "",
    allergies: "",
    currentMedicalConditions: "",
    primarySubstance: "",
    primarySubstanceMethodOfUse: "",
    secondarySubstances: "",
    pastAddictionTreatment: "",
    withdrawalSymptoms: "",
    socialSupportNetwork: "",
    historyOfTraumaOrAbuse: "",
  });

  const [errors, setErrors] = useState({});
  

  // Validate form based on the current step
  const validateForm = (currentStep) => {
    let formErrors = {};
    const phoneNumberPattern = /^[0-9]{10}$/;
    const currentDate = new Date().toISOString().split("T")[0]; // Current date

    if (currentStep === 1) {
      if (!formData.name) formErrors.name = "Name is required";
      if (!formData.fatherName) formErrors.fatherName = "Father’s Name is required";
      if (!formData.grandfatherName) formErrors.grandfatherName = "Grandfather’s Name is required";
      if (!formData.phoneNumber) {
        formErrors.phoneNumber = "Phone Number is required";
      } else if (!phoneNumberPattern.test(formData.phoneNumber)) {
        formErrors.phoneNumber = "Phone Number must be 10 digits";
      }
      if (!formData.dateOfBirth) {
        formErrors.dateOfBirth = "Date of Birth is required";
      } else if (formData.dateOfBirth > currentDate) {
        formErrors.dateOfBirth = "Date of Birth cannot be in the future";
      }
      if (!formData.gender) formErrors.gender = "Gender is required";
      if (!formData.address) formErrors.address = "Address is required";
    } else if (currentStep === 2) {
      if (!formData.employmentStatus) formErrors.employmentStatus = "Employment Status is required";
      if (!formData.patientType) formErrors.patientType = "Patient Type is required";
    } else if (currentStep === 3) {
      if (!formData.primarySubstance) formErrors.primarySubstance = "Primary Substance is required";
      if (!formData.primarySubstanceMethodOfUse) formErrors.primarySubstanceMethodOfUse = "Method of Use is required";
      if (!formData.pastAddictionTreatment) formErrors.pastAddictionTreatment = "Past Addiction Treatment is required";
      if (!formData.withdrawalSymptoms) formErrors.withdrawalSymptoms = "Withdrawal Symptoms is required";
      if (!formData.socialSupportNetwork) formErrors.socialSupportNetwork = "Social Support Network is required";
      if (!formData.historyOfTraumaOrAbuse) formErrors.historyOfTraumaOrAbuse = "History of Trauma or Abuse is required";
    }

    return formErrors;
  };

  // Go to the next step if validation passes
  const nextStep = () => {
    const formErrors = validateForm(step);
    if (Object.keys(formErrors).length === 0) {
      setStep(step + 1);
      setErrors({});
    } else {
      setErrors(formErrors);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  const handleSubmit = async () => {
    const formErrors = validateForm(step);
    if (Object.keys(formErrors).length === 0) {
      try {
        const patientData = {
          ...formData,
          role: "patient",
        };

        const response = await axios.post(
          "http://localhost:5000/api/patients/add-patient",
          patientData,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        if (response.status === 201) {
          alert("Patient added successfully!");
        } else {
          throw new Error("Failed to add patient.");
        }
      } catch (error) {
        console.error("Error adding patient:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div>
      {step === 1 && (
        <PersonalInfo
          formData={formData}
          handleChange={handleChange}
          nextStep={nextStep}
          errors={errors}
        />
      )}
      {step === 2 && (
        <PatientInfo
          formData={formData}
          handleChange={handleChange}
          prevStep={prevStep}
          nextStep={nextStep}
          errors={errors}
        />
      )}
      {step === 3 && (
        <MedicalHistory
          formData={formData}
          handleChange={handleChange}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </div>
  );
}

// Page 1: Personal Information
function PersonalInfo({ formData, handleChange, nextStep, errors }) {
  return (
    <div>
      <h2>Personal Information</h2>
      <form>
        <div className="form-group">
          <label>Name: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Father’s Name: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            value={formData.fatherName}
            onChange={handleChange("fatherName")}
            required
          />
          {errors.fatherName && <span className="error">{errors.fatherName}</span>}
        </div>
        <div className="form-group">
          <label>Grandfather’s Name: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            value={formData.grandfatherName}
            onChange={handleChange("grandfatherName")}
            required
          />
          {errors.grandfatherName && <span className="error">{errors.grandfatherName}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            required
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <label>Date of Birth: <span className="required-asterisk">*</span></label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            required
          />
          {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
        </div>
        <div className="form-group">
          <label>Gender: <span className="required-asterisk">*</span></label>
          <select
            value={formData.gender}
            onChange={handleChange("gender")}
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label>Address: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            value={formData.address}
            onChange={handleChange("address")}
            required
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <button type="button" onClick={nextStep}>
          Next
        </button>
      </form>
    </div>
  );
}

// Page 2: Patient Information
function PatientInfo({ formData, handleChange, prevStep, nextStep, errors }) {
  return (
    <div>
      <h2>Patient Information</h2>
      <form>
        <div className="form-group">
          <label>Employment Status: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            list="employment-status-options"
            value={formData.employmentStatus}
            onChange={handleChange("employmentStatus")}
            required
          />
          <datalist id="employment-status-options">
            <option value="Employed" />
            <option value="Unemployed" />
            <option value="Student" />
            <option value="Retired" />
          </datalist>
          {errors.employmentStatus && <span className="error">{errors.employmentStatus}</span>}
        </div>

        <div className="form-group">
          <label>Educational Level:</label>
          <input
            type="text"
            list="educational-level-options"
            value={formData.educationalLevel}
            onChange={handleChange("educationalLevel")}
            required
          />
          <datalist id="educational-level-options">
            <option value="Primary School" />
            <option value="High School" />
            <option value="College" />
            <option value="Postgraduate" />
          </datalist>
        </div>

        <div className="form-group">
          <label>Living Situation: <span className="required-asterisk">*</span></label>
          <select
            value={formData.livingSituation}
            onChange={handleChange("livingSituation")}
            required
          >
            <option value="" disabled>
              Select Living Situation
            </option>
            <option value="Alone">Alone</option>
            <option value="Family">Family</option>
          </select>
          {errors.livingSituation && <span className="error">{errors.livingSituation}</span>}
        </div>

        <div className="form-group">
          <label>Patient Type: <span className="required-asterisk">*</span></label>
          <select
            value={formData.patientType}
            onChange={handleChange("patientType")}
            required
          >
            <option value="" disabled>
              Select Patient Type
            </option>
            <option value="In-patient">In-patient</option>
            <option value="Out-patient">Out-patient</option>
          </select>
          {errors.patientType && <span className="error">{errors.patientType}</span>}
        </div>

        {formData.patientType === "In-patient" && (
          <>
            <div className="form-group">
              <label>Room Number:</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={handleChange("roomNumber")}
              />
            </div>
            <div className="form-group">
              <label>Bed Number:</label>
              <input
                type="text"
                value={formData.bedNumber}
                onChange={handleChange("bedNumber")}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Allergies:</label>
          <input
            type="text"
            value={formData.allergies}
            onChange={handleChange("allergies")}
          />
        </div>
        <button type="button" onClick={prevStep}>
          Back
        </button>
        <button type="button" onClick={nextStep}>
          Next
        </button>
      </form>
    </div>
  );
}
// Page 3: Medical History (With all the fields intact)
function MedicalHistory({ formData, handleChange, prevStep, handleSubmit, errors }) {
  return (
    <div>
      <h2>Initial Medical History</h2>
      <form>
        <div className="form-group">
          <label>Current Medical Conditions:</label>
          <input
            type="text"
            value={formData.currentMedicalConditions}
            onChange={handleChange("currentMedicalConditions")}
          />
        </div>

        <div className="form-group">
          <label>Primary Substance: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            list="primary-substance-options"
            value={formData.primarySubstance}
            onChange={handleChange("primarySubstance")}
            required
          />
          <datalist id="primary-substance-options">
            <option value="Alcohol" />
            <option value="Tobacco" />
            <option value="Marijuana" />
            <option value="Cocaine" />
          </datalist>
          {errors.primarySubstance && <span className="error">{errors.primarySubstance}</span>}
        </div>

        <div className="form-group">
          <label>Method of Use: <span className="required-asterisk">*</span></label>
          <select
            value={formData.primarySubstanceMethodOfUse}
            onChange={handleChange("primarySubstanceMethodOfUse")}
            required
          >
            <option value="" disabled>
              Select Method of Use
            </option>
            <option value="Oral">Oral</option>
            <option value="Injection">Injection</option>
            <option value="Inhalation">Inhalation</option>
            <option value="Other">Other</option>
          </select>
          {errors.primarySubstanceMethodOfUse && <span className="error">{errors.primarySubstanceMethodOfUse}</span>}
        </div>

        <div className="form-group">
          <label>Secondary Substances:</label>
          <input
            type="text"
            value={formData.secondarySubstances}
            onChange={handleChange("secondarySubstances")}
          />
        </div>

        <div className="form-group">
          <label>Past Addiction Treatment: <span className="required-asterisk">*</span></label>
          <select
            value={formData.pastAddictionTreatment}
            onChange={handleChange("pastAddictionTreatment")}
            required
          >
            <option value="" disabled>
              Select Option
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.pastAddictionTreatment && <span className="error">{errors.pastAddictionTreatment}</span>}
        </div>

        <div className="form-group">
          <label>Withdrawal Symptoms: <span className="required-asterisk">*</span></label>
          <select
            value={formData.withdrawalSymptoms}
            onChange={handleChange("withdrawalSymptoms")}
            required
          >
            <option value="" disabled>
              Select Option
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.withdrawalSymptoms && <span className="error">{errors.withdrawalSymptoms}</span>}
        </div>

        <div className="form-group">
          <label>Social Support Network: <span className="required-asterisk">*</span></label>
          <select
            value={formData.socialSupportNetwork}
            onChange={handleChange("socialSupportNetwork")}
            required
          >
            <option value="" disabled>
              Select Network
            </option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Support Group">Support Group</option>
            <option value="Other">Other</option>
            <option value="None">None</option>
          </select>
          {errors.socialSupportNetwork && <span className="error">{errors.socialSupportNetwork}</span>}
        </div>

        <div className="form-group">
          <label>History of Trauma or Abuse: <span className="required-asterisk">*</span></label>
          <select
            value={formData.historyOfTraumaOrAbuse}
            onChange={handleChange("historyOfTraumaOrAbuse")}
            required
          >
            <option value="" disabled>
              Select Option
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.historyOfTraumaOrAbuse && <span className="error">{errors.historyOfTraumaOrAbuse}</span>}
        </div>

        <button type="button" onClick={prevStep}>
          Back
        </button>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPatientForm;

