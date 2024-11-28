import React from "react";
import { useNavigate } from "react-router-dom";

import "../Styling/signup.css";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        name: "",
        fatherName: "",
        grandfatherName: "",
        phoneNumber: "",
        password: "",
        confirmpw: "",
        role: "",
        dateOfBirth: "",
        gender: "",
        address: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Check if the name fields contain a number or not
    function checkString(s){
        return /^[a-zA-Z]+$/.test(s);
    }

    // Validate phone number
    function validatePhoneNumber(phoneNumber) {
        var regex = /^\d{10}$/;
        return regex.test(phoneNumber);
    }

    const validateForm = () => {
        if(formData.name==="" || formData.fatherName==="" || formData.grandfatherName==="" || formData.phoneNumber==="" || formData.password==="" || formData.confirmpw==="" || formData.role==="" || formData.dateOfBirth==="" || formData.gender==="" || formData.address===""){
            alert("Please fill out all fields");
            return false;
        }
        if(!checkString(formData.name) || !checkString(formData.fatherName) || !checkString(formData.grandfatherName)){
            alert("Name fields can only contain letters");
            return false;

        }
        if(!validatePhoneNumber(formData.phoneNumber)){
            alert("Please enter a valid 10 digit phone number");
            return false;
        }

        // validate password lenght
        if(formData.password.length < 6){
            alert("Password must be at least 8 characters");
            return false;
        }

        // check if password matches the confirm password
        if(formData.password !== formData.confirmpw){
            alert("Passwords do not match");
            return false;
        }

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!validateForm()){
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/user/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            const result = await response.json();
            if (result.user._id) {
                alert("User added Successfully. Please login.");
                navigate("/login");
            } else {
                alert("Registration Failed. Please try again.");
            }
        } catch (error) {
            alert("User with this phone number already exists!");
            // console.error(error);
        }
    };

    return (
        <div className="signup-container">
            <h1>Signup</h1>
            <form>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter first name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Father's Name:
                    <input
                        type="text"
                        name="fatherName"
                        placeholder="Enter father's name"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Grandfather's Name:
                    <input
                        type="text"
                        name="grandfatherName"
                        placeholder="Enter grandfather's name"
                        value={formData.grandfatherName}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Phone Number:
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Confirm Password:
                    <input
                        type="password"
                        name="confirmpw"
                        placeholder="Confirm password"
                        value={formData.confirmpw}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Role:
                    <select
                        name="role"
                        onChange={handleInputChange}
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>
                            Select role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="patient">Patient</option>
                        <option value="professional">Professional</option>
                    </select>
                </label>

                <label>
                    Date of Birth:
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Gender:
                    <select
                        name="gender"
                        onChange={handleInputChange}
                        defaultValue=""
                        required
                    >
                        <option value="" disabled>
                            Select your gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <button type="submit" onClick={handleSubmit}>
                    Signup
                </button>
            </form>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
};

export default Signup;
