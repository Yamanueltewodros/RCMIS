import React, { useState } from 'react';
import "../../Styling/AdminPageStyles/ProfessionalManagementStyles/AddProfessional.css";

import axios from 'axios';

function AddProfessional() {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    grandfatherName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    qualification: '',
    speciality: '',
    licenseNumber: '',
    yearsOfExperience: '',
    department: '',
    type: '',
    bio: '', // Bio is optional
    languagesSpoken: '',
    workingHours: '',
  });

  const [errors, setErrors] = useState({});

  // Validate phone number based on the rules provided
  const validatePhoneNumber = (number) => {
    const phonePattern = /^0[79][0-9]{8}$/; // Starts with 0, second digit 7 or 9, and total length 10 digits
    const isNotAllZeros = number !== '0000000000';
    return phonePattern.test(number) && isNotAllZeros;
  };

  // Custom validation logic
  const validateForm = () => {
    let formErrors = {};

    // Validate required fields
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.fatherName) formErrors.fatherName = "Father's Name is required";
    if (!formData.grandfatherName) formErrors.grandfatherName = "Grandfather's Name is required";
    if (!formData.phoneNumber) formErrors.phoneNumber = "Phone Number is required";
    if (!formData.dateOfBirth) formErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.gender) formErrors.gender = "Gender is required";
    if (!formData.address) formErrors.address = "Address is required";
    if (!formData.qualification) formErrors.qualification = "Qualification is required";
    if (!formData.speciality) formErrors.speciality = "Speciality is required";
    if (!formData.licenseNumber) formErrors.licenseNumber = "License Number is required";
    if (!formData.yearsOfExperience) formErrors.yearsOfExperience = "Years of Experience is required";
    if (!formData.department) formErrors.department = "Department is required";
    if (!formData.type) formErrors.type = "Type is required";
    if (!formData.languagesSpoken) formErrors.languagesSpoken = "Languages Spoken are required";
    if (!formData.workingHours) formErrors.workingHours = "Working Hours are required";

    // Validate phone number
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      formErrors.phoneNumber = "Phone number must start with 0, followed by 7 or 9, and be 10 digits long.";
    }

    // Add other custom validations
    if (formData.yearsOfExperience < 0) {
      formErrors.yearsOfExperience = "Years of experience cannot be negative.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      // First, check if a user with this phone number already exists
      const checkResponse = await axios.get(`http://localhost:5000/api/professionals/check-phone/${formData.phoneNumber}`);
      
      if (checkResponse.data.exists) {
        alert("A user with this phone number already exists. Please use a different phone number.");
        return;
      }

      // If the phone number is unique, proceed with creating the professional
      const professionalData = {
        ...formData,
        // password: 'password123', // Set default password
        role: 'professional', // Add professional role
      };
      await axios.post('http://localhost:5000/api/professionals/add-professional', professionalData);
      alert('Professional created successfully');
      setFormData({
        name: '',
        fatherName: '',
        grandfatherName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        qualification: '',
        speciality: '',
        licenseNumber: '',
        yearsOfExperience: '',
        department: '',
        type: '',
        bio: '', // Reset bio (optional)
        languagesSpoken: '',
        workingHours: '',
      });
    } catch (error) {
      console.error('Error creating professional:', error);
      alert(`Error creating professional: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="add-professional-container">
      <h1>Add New Professional</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Name<span className="required">*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Father's Name */}
        <div className="form-group">
          <label htmlFor="fatherName">Father's Name<span className="required">*</span></label>
          <input type="text" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
          {errors.fatherName && <span className="error-text">{errors.fatherName}</span>}
        </div>

        {/* Grandfather's Name */}
        <div className="form-group">
          <label htmlFor="grandfatherName">Grandfather's Name<span className="required">*</span></label>
          <input type="text" id="grandfatherName" name="grandfatherName" value={formData.grandfatherName} onChange={handleChange} required />
          {errors.grandfatherName && <span className="error-text">{errors.grandfatherName}</span>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number<span className="required">*</span></label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth<span className="required">*</span></label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
          {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label htmlFor="gender">Gender<span className="required">*</span></label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address">Address<span className="required">*</span></label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>

        {/* Qualification */}
        <div className="form-group">
          <label htmlFor="qualification">Qualification<span className="required">*</span></label>
          <input type="text" id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} required />
          {errors.qualification && <span className="error-text">{errors.qualification}</span>}
        </div>

        {/* Speciality */}
        <div className="form-group">
          <label htmlFor="speciality">Speciality<span className="required">*</span></label>
          <input type="text" id="speciality" name="speciality" value={formData.speciality} onChange={handleChange} required />
          {errors.speciality && <span className="error-text">{errors.speciality}</span>}
        </div>

        {/* License Number */}
        <div className="form-group">
          <label htmlFor="licenseNumber">License Number<span className="required">*</span></label>
          <input type="text" id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
          {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
        </div>

        {/* Years of Experience */}
        <div className="form-group">
          <label htmlFor="yearsOfExperience">Years of Experience<span className="required">*</span></label>
          <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required min="0" />
          {errors.yearsOfExperience && <span className="error-text">{errors.yearsOfExperience}</span>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label htmlFor="department">Department<span className="required">*</span></label>
          <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} required />
          {errors.department && <span className="error-text">{errors.department}</span>}
        </div>

        {/* Type */}
        <div className="form-group">
          <label htmlFor="type">Type<span className="required">*</span></label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required>
            <option value="" disabled>Select Type</option>
            <option value="isolated">Isolated</option>
            <option value="group">Group</option>
            <option value="physical">Physical</option>
          </select>
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div>

      {/* Languages Spoken */}
              <div className="form-group">
                <label htmlFor="languagesSpoken">Languages Spoken (comma-separated)<span className="required">*</span></label>
                <input type="text" id="languagesSpoken" name="languagesSpoken" value={formData.languagesSpoken} onChange={handleChange} required />
                {errors.languagesSpoken && <span className="error-text">{errors.languagesSpoken}</span>}
              </div>

              {/* Working Hours */}
              <div className="form-group">
                <label htmlFor="workingHours">Working Hours<span className="required">*</span></label>
                <input type="text" id="workingHours" name="workingHours" value={formData.workingHours} onChange={handleChange} required />
                {errors.workingHours && <span className="error-text">{errors.workingHours}</span>}
              </div>
              
        {/* Bio (Optional) */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange}></textarea>
        </div>

        

        {/* Submit Button */}
        <button type="submit" className="submit-btn">Add Professional</button>
      </form>
    </div>
  );
}

export default AddProfessional;
