const express = require("express");
const signupRoute = require("./routes/Signup");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createAdminAccount } = require("./scripts/setup");
const loginRoute = require("./routes/Login");
const authenticatedRoute = require("./routes/Authenticated");
const professionalManagementRoute = require("./routes/Admin routes/ProfessionalManagement");
const patientManagementRoute = require("./routes/Admin routes/PatientManagement");
const caregiverManagementRoute = require("./routes/CaregiverManagement");
const patientHistoryManagementRoute = require("./routes/PatientHistoryManagement");
const scheduleRoute = require("./routes/ScheduleRoutes");
const {
    updateSchedule,
    updateAvailabilityBasedOnTime,
} = require("./controller/ScheduleController");
const {
    updateAppointmentStatus,
} = require("./controller/AppointmentController");
const appointmentManagementRoute = require("./routes/AppointmentManagement");
const feedbackRoute = require("./routes/Feedback");
const progressManagementRoute = require("./routes/ProgressManagement");
const reportRoute = require("./routes/ReportManagement");
const chatRoute = require("./routes/ChatRoutes");
const predictionRoute = require("./routes/PredictionRoute");
const engagementRoute = require("./routes/EngagementRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Specify your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Weekly schedule update
updateSchedule();

// Update availability based on time - hourly schedule update
const updateAvailability = async () => {
    try {
        await updateAvailabilityBasedOnTime();
        await updateAppointmentStatus();
        console.log("Availability updated successfully");
    } catch (error) {
        console.error("Error updating availability:", error);
    }
};

// Function to schedule the next update at the top of the hour
const scheduleNextUpdate = () => {
    const now = new Date();
    const nextHour = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1,
        0,
        0,
        0
    );
    const delay = nextHour.getTime() - now.getTime();

    setTimeout(() => {
        updateAvailability();
        scheduleNextUpdate(); // Schedule the next update
    }, delay);
};

// Update availability immediately when the server starts
updateAvailability();

// Schedule the first update at the next hour mark
scheduleNextUpdate();

createAdminAccount();

app.use("/user", signupRoute);
app.use("/auth", loginRoute);
app.use("/api", authenticatedRoute);
app.use("/api/professionals", professionalManagementRoute);
app.use("/api/patients", patientManagementRoute);
app.use("/api/caregiver", caregiverManagementRoute);
app.use("/api/patient-history", patientHistoryManagementRoute);
app.use("/api/schedule", scheduleRoute);
app.use("/api/appointment", appointmentManagementRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/progress", progressManagementRoute);
app.use("/api/report", reportRoute);
app.use("/api/chat", chatRoute);
app.use("/api/prediction", predictionRoute);
app.use("/api/engagement", engagementRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
