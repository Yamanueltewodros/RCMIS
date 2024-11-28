const express = require("express");
const router = express.Router();
const {
    userStats,
    appointmentStats,
    statsForProfessional,
    statsForPatient,
} = require("../controller/ReportController");

router.get("/user-stats", userStats);
router.get("/appointment-stats", appointmentStats);
router.get("/stats-for-professional/:userId", statsForProfessional);
router.get("/stats-for-patient/:userId", statsForPatient);

module.exports = router;
