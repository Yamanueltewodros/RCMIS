import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import "./ProfessionalStyles/Predictions.css";

const RelapsePredictionForm = () => {
    const [formData, setFormData] = useState({
        Age: '',
        Gender: '',
        "Type of Treatment Received": '',
        "Number of Relapses": '',
        "Time since last relapse": '',
        "Mental Health Condition": '',
        "Support System": '',
        "Housing Status": '',
        "Employment Status": '',
        "Substance Use Frequency": '',
        "Duration of Substance Use": '',
        "Primary Substance": '',
        "Secondary Substance": '',
        "Family Addiction History": '',
        "Severity of Addiction": '',
        "partial_leak_feature": '',
    });

    const [open, setOpen] = useState(false);
    const [predictionResult, setPredictionResult] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const patientId = "somePatientId"; // Replace with actual patient ID
        try {
            const response = await fetch(`http://localhost:5000/api/prediction/predict/${patientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPredictionResult(`Prediction result: ${data.predictions}`);
            setOpen(true); // Open the dialog
        } catch (error) {
            console.error('Error submitting form:', error);
            setPredictionResult('Error submitting form');
            setOpen(true); // Open the dialog
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <TextField
                fullWidth
                margin="normal"
                label="Age"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                required
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="1">Male</MenuItem>
                    <MenuItem value="2">Female</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Type of Treatment Received</InputLabel>
                <Select
                    name="Type of Treatment Received"
                    value={formData["Type of Treatment Received"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">Inpatient</MenuItem>
                    <MenuItem value="1">Outpatient</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                label="Number of Relapses"
                name="Number of Relapses"
                value={formData["Number of Relapses"]}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Time since last relapse (days)"
                name="Time since last relapse"
                value={formData["Time since last relapse"]}
                onChange={handleChange}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Mental Health Condition</InputLabel>
                <Select
                    name="Mental Health Condition"
                    value={formData["Mental Health Condition"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">None</MenuItem>
                    <MenuItem value="1">Depression</MenuItem>
                    <MenuItem value="2">Anxiety</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Support System</InputLabel>
                <Select
                    name="Support System"
                    value={formData["Support System"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">None</MenuItem>
                    <MenuItem value="1">Family</MenuItem>
                    <MenuItem value="2">Friends</MenuItem>
                    <MenuItem value="3">Community</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Housing Status</InputLabel>
                <Select
                    name="Housing Status"
                    value={formData["Housing Status"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">Homeless</MenuItem>
                    <MenuItem value="1">Temporary Housing</MenuItem>
                    <MenuItem value="2">Stable Housing</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Employment Status</InputLabel>
                <Select
                    name="Employment Status"
                    value={formData["Employment Status"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">Unemployed</MenuItem>
                    <MenuItem value="1">Employed</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                label="Substance Use Frequency"
                name="Substance Use Frequency"
                value={formData["Substance Use Frequency"]}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                label="Duration of Substance Use"
                name="Duration of Substance Use"
                value={formData["Duration of Substance Use"]}
                onChange={handleChange}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Primary Substance</InputLabel>
                <Select
                    name="Primary Substance"
                    value={formData["Primary Substance"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">Alcohol</MenuItem>
                    <MenuItem value="1">Opioid</MenuItem>
                    <MenuItem value="2">Cocaine</MenuItem>
                    <MenuItem value="3">Stimulants</MenuItem>
                    <MenuItem value="4">Prescription Drugs</MenuItem>
                    <MenuItem value="5">Other</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Secondary Substance</InputLabel>
                <Select
                    name="Secondary Substance"
                    value={formData["Secondary Substance"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">None</MenuItem>
                    <MenuItem value="1">Alcohol</MenuItem>
                    <MenuItem value="2">Nicotine</MenuItem>
                    <MenuItem value="3">Stimulants</MenuItem>
                    <MenuItem value="4">Prescription Drugs</MenuItem>
                    <MenuItem value="5">Other</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Family Addiction History</InputLabel>
                <Select
                    name="Family Addiction History"
                    value={formData["Family Addiction History"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Severity of Addiction</InputLabel>
                <Select
                    name="Severity of Addiction"
                    value={formData["Severity of Addiction"]}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="0">Mild</MenuItem>
                    <MenuItem value="1">Moderate</MenuItem>
                    <MenuItem value="2">Severe</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                label="Partial Leak Feature"
                name="partial_leak_feature"
                value={formData["partial_leak_feature"]}
                onChange={handleChange}
                required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                Submit
            </Button>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#333',
                    borderBottom: '1px solid #eaeaea',
                    padding: '20px 24px',
                }}>
                    Prediction Result
                </DialogTitle>
                <DialogContent sx={{ 
                    padding: '24px', 
                    '& p': { 
                        fontSize: '1.1rem',
                        color: '#444',
                        marginBottom: '0',
                    } 
                }}>
                    <p>{predictionResult}</p>
                </DialogContent>
                <DialogActions sx={{ 
                    padding: '16px 24px',
                    borderTop: '1px solid #eaeaea',
                }}>
                    <Button 
                        onClick={handleClose} 
                        sx={{
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#303f9f',
                            },
                            borderRadius: '8px',
                            padding: '8px 16px',
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RelapsePredictionForm;
