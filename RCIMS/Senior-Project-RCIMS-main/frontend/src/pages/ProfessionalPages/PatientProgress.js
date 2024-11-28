import React, { useState } from "react";
import axios from "axios";
//import "./PatientProgress.css"; // Optional: Add your styles here
import { Paper,TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const PatientProgressForm = ({ patientId, onSubmitSuccess, onGoBack }) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bmi: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    spo2: "",
    bloodglucose: "",
    CBC: "",
    frequencyOfUse: "",
    quantityOfUse: "",
    numberOfCravings: "",
    asiScore: "",
    asiCategory: "",
    ALT: "",
    AST: "",
    ALP: "",
    serumCreatinine: "",
    urinalysis: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // Track the current step of the form
  const [error, setError] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/patient-progress", // Adjust API endpoint as needed
        {
          ...formData,
          patient: patientId, // Pass the patientId along with form data
        }
      );
      alert("Progress report submitted successfully!");
      if (onSubmitSuccess) onSubmitSuccess(); // Call the function if provided
      setFormData({
        height: "",
        weight: "",
        bmi: "",
        bloodPressure: "",
        heartRate: "",
        respiratoryRate: "",
        spo2: "",
        bloodglucose: "",
        CBC: "",
        frequencyOfUse: "",
        quantityOfUse: "",
        numberOfCravings: "",
        asiScore: "",
        asiCategory: "",
        ALT: "",
        AST: "",
        ALP: "",
        serumCreatinine: "",
        urinalysis: "",
      });
      setCurrentStep(1); // Reset to step 1 after submission
    } catch (error) {
      console.error("Error submitting progress report:", error);
      setError("Error submitting progress report.");
    }
  };

  // Render the first step of the form
  const renderStep1 = () => (
    <><Paper> 
    <div className="form-step-1">
               
        {/* Name */}
     <div className="container">
        <TextField 
          label="Height"
          name="height"
          value={formData.height}
          onChange={handleInputChange}
          required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        {/* Father's Name */}
        <TextField
        sx={{height:"50px"}}
          label="Weight (kg)"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     
        <div className="container">
        <TextField 
          label="BMI"
          name="bmi"
          value={formData.bmi}
          onChange={handleInputChange}
          required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="Blood Pressure (mmHg)"
          name="bloodPressure"
          value={formData.bloodPressure}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     <div className="container">
        <TextField 
          label="Heart Rate (bpm)"
          name="heartRate"
          value={formData.heartRate}
          onChange={handleInputChange}
          required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="Respiratory Rate (breaths/min)"
          name="respiratoryRate"
          value={formData.respiratoryRate}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     <div className="container">
        <TextField 
          label="SpO2 (%)"
          name="spo2"
          value={formData.spo2}
          onChange={handleInputChange}
          requireddi
          fullWidth
          sx={{paddingRight:"5px"}}
        />    
     </div>
 
      {/* Back button to navigate back to the details page */}
      <div className="flex "> 
      <button  type="button" className="w-1/2" onClick={onGoBack}>Back to Details</button>
      <button  type="button" className="w-1/2" onClick={() => setCurrentStep(2)}>Next</button>
      </div>
    </div>
    </Paper>
    </>
  );

  // Render the second step of the form
  const renderStep2 = () => (
    
    <div className="form-step-2">
      <div className="container">
        <TextField 
          label="Blood Glucose (mg/dL)"
          name="bloodglucose"
        value={formData.bloodglucose}
        onChange={handleInputChange}
        required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="CBC (Complete Blood Count)"
          name="CBC"
          value={formData.CBC}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     <div className="container">
        <TextField 
          label="Frequency of Use (times/week)"
          name="frequencyOfUse"
          value={formData.frequencyOfUse}
          onChange={handleInputChange}
          required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="Quantity of Use (grams)"
          name="quantityOfUse"
          value={formData.quantityOfUse}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     <div className="container">
        <TextField 
          label="Number of Cravings (per week)"
          name="numberOfCravings"
        value={formData.numberOfCravings}
        onChange={handleInputChange}
        required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="ASI Score"
          name="asiScore"
          value={formData.asiScore}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     
     <div className="container">
        <TextField 
          label="ASI Category"
          name="asiCategory"
          value={formData.asiCategory}
          onChange={handleInputChange}
          required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="ALT (U/L)"
          name="ALT"
          value={formData.ALT}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     <div className="container">
        <TextField 
          label="AST (U/L)"
          name="AST"
          value={formData.AST}
          onChange={handleInputChange}
          required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="ALP (U/L)"
          name="ALP"
          value={formData.ALP}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>

     <div className="container">
        <TextField 
          label="Serum Creatinine (mg/dL)"
          name="serumCreatinine"
          value={formData.serumCreatinine}
          onChange={handleInputChange}
          required
          fullWidth
          sx={{paddingRight:"5px"}}
        />

        
        <TextField
          label="Urinalysis Results"
          name="urinalysis"
          value={formData.urinalysis}
          onChange={handleInputChange}
          required
          fullWidth
        />          
     </div>
     
      <div className="flex .action-buttons ">
          <button type="submit" className="w-1/2" onClick={() => setCurrentStep(1)}>Back</button>
          <button type="submit" className="w-1/2">Submit Report</button>
       </div>
      </div>
   
  );

  return (
    // <div className="patient-progress-form">
      <Paper elevation={0}>

       <h2 className="patient-name">Submit Patient Progress Report</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </form>
      </Paper>
   
    // </div>
  );
};

export default PatientProgressForm;
