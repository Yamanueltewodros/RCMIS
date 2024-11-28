import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProfessionalLineChart = ({ dashboardData }) => {
    // Check if dashboardData is available before rendering
    if (!dashboardData) {
        return <p>Loading...</p>; // Show loading state if dashboardData is undefined
    }

    const chartData = {
        labels: ['Total Patients', 'Appointments', 'Today\'s Appointments', 'In-Patients', 'Out-Patients'],
        datasets: [
            {
                label: 'Professional Dashboard Metrics',
                data: [
                    dashboardData.numberOfPatients || 0,
                    dashboardData.numberOfAppointments || 0,
                    dashboardData.todayAppointments || 0,
                    dashboardData.numberOfInpatients || 0,
                    dashboardData.numberOfOutpatients || 0
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Slightly transparent fill color
                borderColor: 'rgba(54, 162, 235, 1)', // Line color
                borderWidth: 2,
                fill: true, // Fills area under the line
                tension: 0.3, // Adds curvature to the line for smoother transitions
                pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Point color
                pointBorderColor: '#fff',
                pointRadius: 5, // Point size
                pointHoverRadius: 7, // Point size on hover
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top', // Display the legend at the top
            },
            title: {
                display: true,
                text: 'Professional Dashboard Overview',
                font: {
                    size: 18, // Increased title font size
                },
            },
            tooltip: {
                enabled: true, // Enables tooltips when hovering over data points
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        return `${label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Metrics',
                    font: {
                        size: 14, // X-axis label font size
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Values',
                    font: {
                        size: 14, // Y-axis label font size
                    },
                },
                beginAtZero: true, // Ensures that the chart starts from 0
                ticks: {
                    stepSize: 1, // Ensures that the Y-axis steps by 1
                },
            },
        },
        maintainAspectRatio: false, // Allows more control over chart size
    };

    return <div style={{ height: '400px', width: '100%' }}><Line data={chartData} options={options} /></div>;
};

export default ProfessionalLineChart;
