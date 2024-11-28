import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styling/AdminPageStyles/CareGiverDetails.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

function CaregiverDetail({ patientId, onBack }) {
  const [caregiver, setCaregiver] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    relationshipToPatient: "",
    gender: "",
    address: "",
    officialIdNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/caregiver/get-caregiver-by-patient-id/${patientId}`);
        if (response.data.caregiver) {
          setCaregiver(response.data.caregiver);
          setFormData(response.data.caregiver);
        } else {
          setErrorMessage("Caregiver not found."); // Set error message if no caregiver is found
        }
      } catch (error) {
        console.error("Error fetching caregiver:", error);
        setErrorMessage("Error fetching caregiver."); // Set error message on fetch error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCaregiver();
  }, [patientId]);

  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  const validateForm = () => {
    const formErrors = {};
    const phoneNumberPattern = /^[0-9]{10}$/;

    if (!formData.fullName) formErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber) {
      formErrors.phoneNumber = "Phone Number is required";
    } else if (!phoneNumberPattern.test(formData.phoneNumber)) {
      formErrors.phoneNumber = "Phone Number must be 10 digits";
    }
    if (!formData.relationshipToPatient) formErrors.relationshipToPatient = "Relationship to Patient is required";
    if (!formData.gender) formErrors.gender = "Gender is required";
    if (!formData.address) formErrors.address = "Address is required";
    if (!formData.officialIdNumber) formErrors.officialIdNumber = "Official ID Number is required";

    return formErrors;
  };

  const handleUpdate = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.put(`http://localhost:5000/api/caregiver/update-caregiver/${caregiver._id}`, formData);
        alert(response.data.message);
        setCaregiver(response.data.caregiver);
      } catch (error) {
        console.error("Error updating caregiver:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this caregiver?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/caregiver/delete-caregiver/${caregiver._id}`);
        alert(response.data.message);
        onBack();
      } catch (error) {
        console.error("Error deleting caregiver:", error);
        alert("Failed to delete caregiver. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading caregiver details...</div>; // Show loading message while fetching

  if (errorMessage) return <div>{errorMessage}</div>; // Show error message if caregiver is not found

  return (
    <div>
      <ArrowBackIcon onClick={onBack}/>
      <h2 class="patient-name"> Caregiver Details</h2>

      <form>
          <div className="container">
            {/* Caregiver Full Name */}
             <TextField
                label="Caregiver Full Name"
                name="caregiverFullName"
                value={formData.fullName}
                onChange={handleChange("fullName")} 
                required
                fullWidth
            />
          </div>
          <div className="container">
               
          {/* Phone Number */}
          <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber} onChange={handleChange("phoneNumber")} 
                required
                fullWidth
            />
           {/* Relationship to Patient */}
              <TextField
                  label="Relationship to Patient"
                  name="relationshipToPatient"
                  value={formData.relationshipToPatient}
                  onChange={handleChange("relationshipToPatient")} 
                  required
                  fullWidth
              />                         
                </div>

      <div className="container">
            {/* Gender */}
            <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" label="Gender"
                value={formData.gender}
                 onChange={handleChange("gender")}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </Select>
            </FormControl>

                {/* Address */}
                <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange("address")} 
                    required
                    fullWidth
                />       
    </div>
        <div className="container">
            {/* Official ID Number */}
            <TextField
                label="Official ID Number"
                name="officialIdNumber"
                value={formData.officialIdNumber}
                 onChange={handleChange("officialIdNumber")} 
                required
                fullWidth
            />
        
        </div>

        <div className="flex w-full">
          <button fullWidth className="edit-button" type="button" onClick={handleUpdate}>Update Caregiver</button>
          <button fullWidth className="CareGiver-button" type="button" onClick={handleDelete}>Delete Caregiver</button>
        </div>

      </form>
    </div>
  );
}

export default CaregiverDetail;
