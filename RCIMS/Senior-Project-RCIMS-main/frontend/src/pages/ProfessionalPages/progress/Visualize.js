import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Button } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressVisualization = ({ patientId }) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/progress/get-all-progress/${patientId}`
        );
        setProgressData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setError("Failed to load progress data. Please try again.");
        setLoading(false);
      }
    };

    if (patientId) {
      fetchProgressData();
    } else {
      setError("No patient ID provided.");
      setLoading(false);
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading progress data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const labels = progressData.map((data) => new Date(data.createdAt).toLocaleDateString());

  const basicInfoData = {
    labels,
    datasets: [
      {
        label: "Weight (kg)",
        data: progressData.map((data) => data.weight),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
      {
        label: "Height (m)",
        data: progressData.map((data) => data.height),
        borderColor: "rgb(54, 162, 235)",
        fill: false,
      },
      {
        label: "BMI",
        data: progressData.map((data) => data.bmi),
        borderColor: "rgb(255, 99, 132)",
        fill: false,
      },
    ],
  };

  const vitalSignsData = {
    labels,
    datasets: [
      {
        label: "Blood Pressure",
        data: progressData.map((data) => data.bloodPressure),
        borderColor: "rgb(255, 159, 64)",
        fill: false,
      },
      {
        label: "Heart Rate",
        data: progressData.map((data) => data.heartRate),
        borderColor: "rgb(153, 102, 255)",
        fill: false,
      },
      {
        label: "Respiratory Rate",
        data: progressData.map((data) => data.respiratoryRate),
        borderColor: "rgb(255, 205, 86)",
        fill: false,
      },
      {
        label: "SpO2",
        data: progressData.map((data) => data.spo2),
        borderColor: "rgb(201, 203, 207)",
        fill: false,
      },
    ],
  };

  const labResultsData = {
    labels,
    datasets: [
      {
        label: "Blood Glucose",
        data: progressData.map((data) => data.bloodglucose),
        borderColor: "rgb(255, 99, 132)",
        fill: false,
      },
      {
        label: "CBC",
        data: progressData.map((data) => data.CBC),
        borderColor: "rgb(54, 162, 235)",
        fill: false,
      },
      {
        label: "ALT",
        data: progressData.map((data) => data.ALT),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
      {
        label: "AST",
        data: progressData.map((data) => data.AST),
        borderColor: "rgb(153, 102, 255)",
        fill: false,
      },
      {
        label: "ALP",
        data: progressData.map((data) => data.ALP),
        borderColor: "rgb(255, 159, 64)",
        fill: false,
      },
      {
        label: "Serum Creatinine",
        data: progressData.map((data) => data.serumCreatinine),
        borderColor: "rgb(255, 205, 86)",
        fill: false,
      },
      {
        label: "Urinalysis",
        data: progressData.map((data) => data.urinalysis),
        borderColor: "rgb(201, 203, 207)",
        fill: false,
      },
    ],
  };

  const addictionData = {
    labels,
    datasets: [
      {
        label: "Frequency of Use",
        data: progressData.map((data) => data.frequencyOfUse),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
      {
        label: "Quantity of Use",
        data: progressData.map((data) => data.quantityOfUse),
        borderColor: "rgb(255, 99, 132)",
        fill: false,
      },
      {
        label: "Number of Cravings",
        data: progressData.map((data) => data.numberOfCravings),
        borderColor: "rgb(153, 102, 255)",
        fill: false,
      },
      {
        label: "ASI Score",
        data: progressData.map((data) => data.asiScore),
        borderColor: "rgb(255, 159, 64)",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1>Patient Progress Visualization</h1>

      {/* Navigate back to the Progress page */}
      <Button onClick={() => navigate(`/progress/${patientId}`)} variant="contained" color="primary" style={{ marginBottom: "20px" }}>
        Back
      </Button>

      <h2>Basic Information</h2>
      <Line data={basicInfoData} />

      <h2>Vital Signs</h2>
      <Line data={vitalSignsData} />

      <h2>Lab Results</h2>
      <Line data={labResultsData} />

      <h2>Addiction Data</h2>
      <Line data={addictionData} />
    </div>
  );
};

export default ProgressVisualization;
