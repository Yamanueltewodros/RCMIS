const express = require("express");

const {
    addPatient,
    getPatientById,
    getPatients,
    checkPhoneNumber,
    updatePatient,
    dischargePatient,
    attachProfessional,
    getPatientsByStatus,
    searchPatient,
    getPatientInformation,
    getPatientsToDischarge
} = require("../../controller/PatientController");

const router = express.Router();

router.post("/add-patient", addPatient);
router.get("/get-patient/:id", getPatientById);
router.get("/get-patients", getPatients);
router.get("/check-phone/:phoneNumber", checkPhoneNumber);
router.put("/update-patient/:id", updatePatient);
router.put("/discharge-patient/:id", dischargePatient);
router.post("/attach-professional", attachProfessional);
router.get("/get-patients-by-status/:status", getPatientsByStatus);
router.get("/search-patient/:key", searchPatient);
router.get("/get-patient-information/:id", getPatientInformation);
router.get("/get-patients-to-discharge", getPatientsToDischarge);
module.exports = router;
