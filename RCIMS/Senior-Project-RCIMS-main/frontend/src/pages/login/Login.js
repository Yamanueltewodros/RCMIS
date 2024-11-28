import React, { useState } from "react";
import "../Styling/Login.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import logo from "./RCMIS-1-01.svg";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.phoneNumber || !formData.password) {
            Swal.fire({
                title: 'Error!',
                text: 'Please enter both phone number and password.',
                icon: 'error',
                confirmButtonText: 'Back'
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            
            if (response.ok) {
                navigate("/dashboard", { replace: true });
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("token", result.token);
            } else {
                alert(result.message || "Login failed. Please check your credentials and try again.");
                // Swal.fire({
                    
                //     title: 'Error!',
                //     text: "An error occurred. Please try again later.",
                //     icon: 'error',
                //     confirmButtonText: 'Back'
                // }); 
                
            }
        } catch (error) {
            console.error("Login error:", error);
            // alert("An error occurred. Please try again later.");
            Swal.fire({
                title: 'Error!',
                text: "An error occurred. Please try again later.",
                icon: 'error',
                confirmButtonText: 'Back'
            });            
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-5/4 max-w-screen-xl min-h-[600px] md:min-h-[700px] bg-white rounded-2xl shadow-lg overflow-hidden mx-auto my-5">

            {/* Right section (Additional Info) */}
            <div className="hidden md:flex md:w-3/5 xl:w-3/5 items-center justify-center p-10 bg-purple-900 text-white bg-no-repeat bg-cover relative">
                <div className="absolute bg-gradient-to-b from-blue-800 to-cyan-400 opacity-75 inset-0 z-0"></div>
                <div className="max-w-md z-10 text-center">
                    <div className="logo">
                    <img src={logo} alt="HealthCare Logo" />
                    </div>
                    <h2 className="text-white text-4xl font-bold leading-tight mb-6">RCMIS</h2>
                    <p className="text-md text-gray-200 font-normal">
                    Recovery starts here, at our compassionate rehabilitation center Where there is Compassionate care, empowering recovery at our rehabilitation facility.
                    </p>
                </div>
            </div>

            {/* Left section (Login form) */}
            <div className="flex flex-col justify-center w-full md:w-2/5 xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back!</h2>
                        <p className="mt-2 text-sm text-gray-500">Please sign in to your account</p>
                    </div>
                    <form className="mt-8 space-y-6 bg-white border-none shadow-none" >
                        <div className="relative">
                            <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">Phone Number</label>
                            <input
                                className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                                type="tel"
                                placeholder="Enter your phone number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mt-8">
                            <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">Password</label>
                            <input
                                className="w-full text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm ">
                                <a href="#" className="text-indigo-400 hover:text-blue-500">Forgot your password?</a>
                            </div>
                        </div>
                        <div className="w-full">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full flex justify-center bg-gradient-to-r from-cyan-300 to-blue-800  text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Login;
