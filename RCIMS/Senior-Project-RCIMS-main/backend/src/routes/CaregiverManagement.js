const express = require("express");

const router = express.Router();

const {
    addCaregiver,
    getCaregiverByPatientId,
    updateCaregiver,
    deleteCaregiver,
} = require("../controller/CaregiverController");

router.post("/add-caregiver", addCaregiver);
router.get("/get-caregiver-by-patient-id/:patientId", getCaregiverByPatientId);
router.put("/update-caregiver/:caregiverId", updateCaregiver);
router.delete("/delete-caregiver/:caregiverId", deleteCaregiver);

module.exports = router;

