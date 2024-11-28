//! This is for development purposes only
const express = require("express");
const router = express.Router();
const {
    addProfessionalSchedule,
    getEarliestAvailableDateProfessional,
    addPatientSchedule,
    updateAvailabilityBasedOnTime,
    getScheduleForUser,
    getCommonAvailableSessions
} = require("../controller/ScheduleController");

// router.post("/professional-schedule", addProfessionalSchedule);
router.get(
    "/professional-schedule/earliest-available-date/:professionalID",
    getEarliestAvailableDateProfessional
);
// router.post("/patient-schedule", addPatientSchedule);
router.put("/update-availability/", updateAvailabilityBasedOnTime);
router.get("/schedule/:userId", getScheduleForUser);

module.exports = router;
