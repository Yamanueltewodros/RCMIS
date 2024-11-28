import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import "../../Styling/AdminPageStyles/AddPatient.css";

function AddPatientForm() {
  const [step, setStep] = useState(1);
  const [skipCaregiver, setSkipCaregiver] = useState(false);
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
    caregiverFullName: "",
    caregiverPhoneNumber: "",
    caregiverRelationshipToPatient: "",
    caregiverGender: "",
    caregiverAddress: "",
    caregiverOfficialIdNumber: "",
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
      if (!formData.educationalLevel) formErrors.educationalLevel="Educational level is required"
    } else if (currentStep === 3) {
      if (!formData.primarySubstance) formErrors.primarySubstance = "Primary Substance is required";
      if (!formData.primarySubstanceMethodOfUse) formErrors.primarySubstanceMethodOfUse = "Method of Use is required";
      if (!formData.pastAddictionTreatment) formErrors.pastAddictionTreatment = "Past Addiction Treatment is required";
      if (!formData.withdrawalSymptoms) formErrors.withdrawalSymptoms = "Withdrawal Symptoms is required";
      if (!formData.socialSupportNetwork) formErrors.socialSupportNetwork = "Social Support Network is required";
      if (!formData.historyOfTraumaOrAbuse) formErrors.historyOfTraumaOrAbuse = "History of Trauma or Abuse is required";
    } else if (currentStep === 4 && !skipCaregiver) {
      if (!formData.caregiverFullName) formErrors.caregiverFullName = "Caregiver's Full Name is required";
      if (!formData.caregiverPhoneNumber) {
        formErrors.caregiverPhoneNumber = "Caregiver's Phone Number is required";
      } else if (!phoneNumberPattern.test(formData.caregiverPhoneNumber)) {
        formErrors.caregiverPhoneNumber = "Caregiver's Phone Number must be 10 digits";
      }
      if (!formData.caregiverRelationshipToPatient) formErrors.caregiverRelationshipToPatient = "Relationship to Patient is required";
      if (!formData.caregiverGender) formErrors.caregiverGender = "Caregiver's Gender is required";
      if (!formData.caregiverAddress) formErrors.caregiverAddress = "Caregiver's Address is required";
      if (!formData.caregiverOfficialIdNumber) formErrors.caregiverOfficialIdNumber = "Official ID Number is required";
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

  const resetForm = () => {
    setFormData({
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
      caregiverFullName: "",
      caregiverPhoneNumber: "",
      caregiverRelationshipToPatient: "",
      caregiverGender: "",
      caregiverAddress: "",
      caregiverOfficialIdNumber: "",
    });
    setStep(1); // Reset to first step
    setSkipCaregiver(false);
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

        if (response.status === 201 && !skipCaregiver) {
          // After patient is added, add caregiver data
          const caregiverData = {
            patientId: response.data.patient._id,
            fullName: formData.caregiverFullName,
            phoneNumber: formData.caregiverPhoneNumber,
            relationshipToPatient: formData.caregiverRelationshipToPatient,
            gender: formData.caregiverGender,
            address: formData.caregiverAddress,
            officialIdNumber: formData.caregiverOfficialIdNumber,
          };

          const caregiverResponse = await axios.post(
            "http://localhost:5000/api/caregiver/add-caregiver",
            caregiverData,
            {
              headers: {
                "Content-Type": "application/json",
              }
            }
          );

          if (caregiverResponse.status === 201) {
            alert("Patient and Caregiver added successfully!");
          } else {
            throw new Error("Failed to add caregiver.");
          }
        } else if (skipCaregiver || response.status === 201) {
          alert("Patient added successfully!");
        }
        resetForm(); // Reset form and return to the first page
      } catch (error) {
        console.error("Error adding patient or caregiver:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="add-patient-container">
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
          nextStep={nextStep}
          errors={errors}
        />
      )}
      {step === 4 && (
        <CaregiverInfo
          formData={formData}
          handleChange={handleChange}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
          setSkipCaregiver={setSkipCaregiver}
          errors={errors}
        />
      )}
    </div>
  );
}

// Page 1: Personal Information
function PersonalInfo({ formData, handleChange, nextStep, errors }) {
  return (
    <div  >
    <h2>Personal Information</h2>
    <form>
    <div className="container">
                <TextField 
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange("name")}
                required
                fullWidth
                sx={{paddingRight:"5px"}}
              />

                    {/* Father's Name */}
              <TextField
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange("fatherName")}
                fullWidth
                required
              />  
            </div>
            <div className="container">

              {/* Grandfather's Name */}
              <TextField
                label="Grandfather's Name"
                name="grandfatherName"
                value={formData.grandfatherName}
                onChange={handleChange("grandfatherName")}
                fullWidth
                sx={{paddingRight:"25px"}}

                required
              />

              {/* Phone Number */}
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                // error={Boolean(error.phoneNumber)}
                // helperText={error.phoneNumber}
                required
                fullWidth
              />
            </div>

            <div className="container">

                  {/* Date of Birth */}
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange("dateOfBirth")}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  sx={{paddingLeft:"10px"}}

                  
                />
              {/* Gender */}
              <FormControl 
              fullWidth  
              sx={{paddingRight:"10px"}}
                required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange("gender")}
                  >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl> 
            </div>

            <div className="container">
                 {/* Address */}
                   <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange("address")}
                    fullWidth
                    required
                  />                      
            </div>
            <button 
            type="submit"
            className="w-3/4"
            onClick={nextStep}>
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
         <div className="container">

            {/* Employee Status */}
            <FormControl 
            fullWidth  
            sx={{paddingRight:"10px"}}
            required>
            <InputLabel>Employment Status</InputLabel>
            <Select
              name="employment-status-options"
              value={formData.employmentStatus}
              onChange={handleChange("employmentStatus")}
              >
              <MenuItem value="Employed" >Employed</MenuItem>
              <MenuItem value="Unemployed">Unemployed</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Retired">Retired</MenuItem>
            </Select>
            </FormControl> 

                        {/* Education Level */}
                        <FormControl 
            fullWidth  
            sx={{paddingRight:"10px"}}
            required>
            <InputLabel>Educational Level</InputLabel>
            <Select
              name="employment-status-options"
              value={formData.educationalLevel}
              onChange={handleChange("educationalLevel")}
              >
              <MenuItem value="Primary School" >Primary School</MenuItem>
              <MenuItem value="High School">High School</MenuItem>
              <MenuItem value="College">College</MenuItem>
              <MenuItem value="Postgraduate">Retired</MenuItem>
            </Select>
            </FormControl> 
          </div>

          <div className="container">
            {/* Living Status */}
            <FormControl 
            fullWidth  
            sx={{paddingRight:"10px"}}
            required>
            <InputLabel>Living Situation</InputLabel>
            <Select
              name="employment-status-options"
              value={formData.livingSituation}
              onChange={handleChange("livingSituation")}
              >
              <MenuItem value="Alone" >Alone</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
            </Select>
            </FormControl>  

          </div>

      <div className="container">
                <FormControl 
            fullWidth  
            sx={{paddingRight:"10px"}}
            required>
            <InputLabel>Patient Type</InputLabel>
            <Select
              name="patientType"
              value={formData.patientType}
              onChange={handleChange("patientType")}
              >
              <MenuItem value="In-patient">In-patient</MenuItem>
              <MenuItem value="Out-patient">Out-patient</MenuItem>
            </Select>
          </FormControl> 
      </div>
 


        {formData.patientType === "In-patient" && (
          <>
            <div className="container">
                 {/* room Number */}
                   <TextField
                    label="Room Number"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange("roomNumber")}
                    fullWidth
                    required
                  />
                 {/* Bed Number */}
                 <TextField
                    label="Bed Number"
                    name="bedNumber"
                    value={formData.bedNumber}
                    onChange={handleChange("bedNumber")}
                    fullWidth
                    required
                  />                                          
            </div>
          </>
          
        )}
        <div className="container">
                           {/* Alergies */}
                           <TextField
                    label="Allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange("allergies")}
                    fullWidth
                    required
                  /> 
        </div>
        <div className="flex">
        <button type="submit" onClick={prevStep}>
          Back
        </button>
        <button type="submit" onClick={nextStep}>
          Next
        </button>          
        </div>

      </form>
    </div>
  );
}

// Page 3: Medical History
function MedicalHistory({ formData, handleChange, prevStep, nextStep, errors }) {
  return (
    <div>
      <h2>Initial Medical History</h2>
      <form>
      <div className="container">
                {/* Current Medical Conditions */}
                <TextField
                    label="Current Medical Conditions"
                    name="Current Medical Conditions"
                    value={formData.currentMedicalConditions}
                    onChange={handleChange("currentMedicalConditions")}
                    fullWidth
                    required
                  /> 
        </div>

     <div className="container">
        {/* Primary Substance*/}
        <FormControl 
          fullWidth  
          sx={{paddingRight:"10px"}}
          required>
          <InputLabel>Primary Substance</InputLabel>
          <Select
            name="primary-substance-options"
            value={formData.primarySubstance}
            onChange={handleChange("primarySubstance")}
            >
            <MenuItem value="Alcohol" >Alcohol</MenuItem>
            <MenuItem value="Tobacco">Tobacco</MenuItem>
            <MenuItem value="Marijuana">Marijuana</MenuItem>
            <MenuItem value="Cocaine">Cocaine</MenuItem>
          </Select>
          </FormControl> 

          {/* Method of Use */}
          <FormControl 
          fullWidth  
          sx={{paddingRight:"10px"}}
          required>
          <InputLabel>Method of Use</InputLabel>
          <Select
            name="primarySubstanceMethodOfUse-options"
            value={formData.primarySubstanceMethodOfUse}
            onChange={handleChange("primarySubstanceMethodOfUse")}
            >
            <MenuItem value="Oral">Oral</MenuItem>
            <MenuItem value="Injection">Injection</MenuItem>
            <MenuItem value="Inhalation">Inhalation</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          </FormControl> 

        </div>
        <div className="container">
            {/* Secondary Substances */}
            <TextField
                label="Secondary Substances"
                name="secondarySubstances"
                value={formData.secondarySubstances}
                onChange={handleChange("secondarySubstances")}
                fullWidth
                required
              /> 
        </div>  

        <div className="container">
        {/* Primary Substance*/}
        <FormControl 
          fullWidth  
          sx={{paddingRight:"10px"}}
          required>
          <InputLabel>Past Addiction Treatment</InputLabel>
          <Select
            name="Past Addiction Treatment"
            value={formData.pastAddictionTreatment}
            onChange={handleChange("pastAddictionTreatment")}
            >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>

          </Select>
          </FormControl> 

          {/* Withdrawal Symptoms */}
          <FormControl 
          fullWidth  
          sx={{paddingRight:"10px"}}
          required>
          <InputLabel>Withdrawal Symptoms</InputLabel>
          <Select
            name="WithdrawalSymptoms-options"
            value={formData.withdrawalSymptoms}
            onChange={handleChange("withdrawalSymptoms")}
            >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
          </FormControl> 

        </div>

        <div className="container">
        {/* Social Support Network*/}
        <FormControl 
          fullWidth  
          sx={{paddingRight:"10px"}}
          required>
          <InputLabel>Social Support Network</InputLabel>
          <Select
            name="Social Support Network"
            value={formData.socialSupportNetwork}
            onChange={handleChange("socialSupportNetwork")}
            >
            <MenuItem value="Family">Family</MenuItem>
            <MenuItem value="Friend">Friend</MenuItem>
            <MenuItem value="Support Group">Support Group</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
            <MenuItem value="None">None</MenuItem>

          </Select>
          </FormControl> 

          {/* History of Trauma or Abuse */}
          <FormControl 
          fullWidth  
          sx={{paddingRight:"10px"}}
          required>
          <InputLabel>History of Trauma or Abuse</InputLabel>
          <Select
            name="History of Trauma or Abuse-options"
            value={formData.historyOfTraumaOrAbuse}
            onChange={handleChange("historyOfTraumaOrAbuse")}
            >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Unknown">Unknown</MenuItem>                     
          </Select>
          </FormControl> 

        </div>


        <div className="flex">
        <button type="submit" onClick={prevStep}>
          Back
        </button>
        <button type="submit" onClick={nextStep}>
          Next
        </button>          
        </div>
      </form>
    </div>
  );
}

// Page 4: Caregiver Information
function CaregiverInfo({ formData, handleChange, prevStep, handleSubmit,setSkipCaregiver,  errors }) {
  return (
    <div>
      <h2>Caregiver Information</h2>
      <form>
      <div className="container">
                {/* Caregiver Full Name */}
                <TextField
                    label="Caregiver Full Name"
                    name="Caregiver Full Name"
                    value={formData.caregiverFullName}
                    onChange={handleChange("caregiverFullName")}
                    fullWidth
                    required
                  /> 
        </div>

        <div className="container">
                        {/* CareGiver's Phone Number */}
                        <TextField
                label="Caregiver Phone Number"
                name="Caregiver Phone Number"
                value={formData.caregiverPhoneNumber}
                onChange={handleChange("caregiverPhoneNumber")}
                // error={Boolean(error.phoneNumber)}
                // helperText={error.phoneNumber}
                required
                fullWidth
              />
                        {/*Relationship to Patient*/}
             <TextField
                label="Relationship to Patient"
                name="Relationship to Patient"
                value={formData.caregiverRelationshipToPatient}
                onChange={handleChange("caregiverRelationshipToPatient")}
                // error={Boolean(error.phoneNumber)}
                // helperText={error.phoneNumber}
                required
                fullWidth
              />              
        </div>

        <div className="container">
          {/* Caregiver Gender */}
          <FormControl 
              fullWidth  
              sx={{paddingRight:"10px"}}
                required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="Caregiver Gender"
                  value={formData.caregiverGender}
                  onChange={handleChange("caregiverGender")}
                  >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl> 

                {/* Caregiver Address */}
                <TextField
                    label="Caregiver Address"
                    name="Caregiver Address"
                    value={formData.caregiverAddress}
                    onChange={handleChange("caregiverAddress")}
                    fullWidth
                    required
                  /> 
      
        </div>

        <div className="container">
                {/*Official ID Number */}
                <TextField
                    label="Official ID Number"
                    name="Official ID Number"
                    value={formData.caregiverOfficialIdNumber}
                    onChange={handleChange("caregiverOfficialIdNumber")}
                    fullWidth
                    required
                  /> 
        </div>

      </form> 
          <div className="flex">
           <button type="submit" onClick={prevStep} 
             className="w-full flex justify-center bg-gradient-to-r from-cyan-300 to-blue-800  text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
            > Back</button>
             <button type="submit" onClick={handleSubmit} 
             className="bg-"
             >Submit</button> 
          </div>
          <button type="submit"
            className="w-full flex justify-center bg-gradient-to-r from-cyan-300 to-blue-800  text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
          // type="button"
          onClick={() => {
            setSkipCaregiver(true);
            handleSubmit();
          }}
          // className="skip-button"
        >
          Skip Caregiver and submit
        </button>
    </div>
  );
}

export default AddPatientForm;
