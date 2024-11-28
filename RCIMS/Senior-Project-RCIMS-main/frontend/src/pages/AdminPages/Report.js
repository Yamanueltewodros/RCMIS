import React from "react";
import axios from "axios";
import Button from "@mui/material/Button"; // Assuming you're using Material UI for buttons

const DownloadPDF = () => {
    const handleDownload = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const patientId = user ? user._id : null;

            if (patientId) {
                const response = await axios.get(`http://localhost:5000/api/patient-history/export-pdf/${patientId}`, {
                    responseType: 'blob'
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'patient_history.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                console.error("Patient ID is not available");
            }
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("Error downloading PDF: " + error.message);
        }
    };

    return (
        <div className="download-pdf-container">
            <Button variant="contained" color="primary" onClick={handleDownload}>
                Download PDF
            </Button>
        </div>
    );
};

export default DownloadPDF;
