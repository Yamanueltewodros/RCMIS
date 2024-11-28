const express = require("express");

const router = express.Router();

const {
    getCommonAvailableSessions,
    addIsolatedAppointment,
    getAllAppointmentsForUser,
    getAppointmentDetails,
    cancelAppointment,
    editAppointment
} = require("../controller/AppointmentController");

router.post("/add-isolated-appointment", addIsolatedAppointment);
router.get("/common-sessions/:professionalId/:patientId", getCommonAvailableSessions);
router.get("/user-appointments/:userId", getAllAppointmentsForUser);
router.get("/appointment-details/:appointmentId", getAppointmentDetails);
router.delete("/cancel-appointment/:appointmentId", cancelAppointment);
router.put("/edit-appointment/:appointmentId", editAppointment);
module.exports = router;
