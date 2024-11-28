import React, { useState, useEffect } from "react";
import { Card, CardContent, Box, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PatientStat = () => {
    const [chartData, setChartData] = useState({
        totalPatients: 0,
        totalProfessionals: 0,
        malePatients: 0,
        femalePatients: 0,
        dischargedPatients: 0,
        inPatients: 0,
        outPatients: 0,
        activeAppointments: 0,
        todayAppointments: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch user statistics (patients, professionals, gender, etc.)
                const userStatsResponse = await axios.get("http://localhost:5000/api/report/user-stats");
                // Fetch appointment statistics (active and today's appointments)
                const appointmentStatsResponse = await axios.get("http://localhost:5000/api/report/appointment-stats");

                // Check if the values exist, use a default value if not
                setChartData({
                    totalPatients: userStatsResponse.data.totalPatients || 0,
                    totalProfessionals: userStatsResponse.data.totalProfessionals || 0,
                    malePatients: userStatsResponse.data.malePatients || 0,
                    femalePatients: userStatsResponse.data.femalePatients || 0,
                    dischargedPatients: userStatsResponse.data.dischargedPatients || 0,
                    inPatients: userStatsResponse.data.inPatients || 0,
                    outPatients: userStatsResponse.data.outPatients || 0,
                    activeAppointments: appointmentStatsResponse.data.activeAppointments || 0,
                    todayAppointments: appointmentStatsResponse.data.todayAppointments || 0,
                });

                setLoading(false); // Data has been fetched
            } catch (error) {
                setError("Error fetching data. Please try again.");
                setLoading(false);
                console.error("Error fetching data:", error);
            }
        };

        fetchStats();
    }, []);

    // Data for the bar chart
    const data = {
        labels: [
            "Total Patients", 
            "Total Professionals", 
            "Male Patients", 
            "Female Patients", 
            "Discharged Patients", 
            "In-Patients", 
            "Out-Patients", 
            "Active Appointments", 
            "Today's Appointments"
        ],
        datasets: [
            {
                label: "Patient and Appointment Stats",
                backgroundColor: [
                    "#bfdbfe", "#d9f99d", "#fecaca", "#fbbf24", "#84cc16", "#10b981", "#3b82f6", "#6366f1", "#f43f5e"
                ],
                data: [
                    chartData.totalPatients,
                    chartData.totalProfessionals,
                    chartData.malePatients,
                    chartData.femalePatients,
                    chartData.dischargedPatients,
                    chartData.inPatients,
                    chartData.outPatients,
                    chartData.activeAppointments,
                    chartData.todayAppointments
                ],
            },
        ],
    };

    // Chart.js options for the bar chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Overview of Patient and Appointment Data",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Card sx={{ height: '100%', width: '100%' }}>
            <CardContent className="w-full h-full">
                <Grid container spacing={2}>
                    {/* Display loading state */}
                    {loading ? (
                        <Box className="w-full h-full flex justify-center items-center">
                            <p>Loading data...</p>
                        </Box>
                    ) : error ? (
                        <Box className="w-full h-full flex justify-center items-center">
                            <p>{error}</p>
                        </Box>
                    ) : (
                        // Bar Chart when data is ready
                        <Grid item xs={12}>
                            <Box className="relative w-full h-[400px] md:h-[500px]">
                                <Bar data={data} options={options} />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PatientStat;
