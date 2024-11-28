const express = require("express");
const {
    addProfessional,
    getProfessionals,
    updateProfessional,
    deleteProfessional,
    getProfessionalById,
    checkPhoneNumber,
    attachPatient,
    removePatientFromProfessional,
    getProfessionalsByStatus,
    getProfessionalsOfPatient,
    getProfessionalsByDepartment,
    getProfessionalsByStatusAndDepartment,
    searchProfessional,
    getPatientsOfProfessional,
    getProfessionalByUserId,
} = require("../../controller/ProfessionalController");

const router = express.Router();

router.post("/add-professional", addProfessional);
router.get("/get-professionals", getProfessionals);
router.put("/update-professional/:id", updateProfessional);
router.delete("/delete-professional/:id", deleteProfessional);
router.get("/professional-details/:id", getProfessionalById);
router.get("/check-phone/:phoneNumber", checkPhoneNumber);
router.post("/attach-patient", attachPatient);
router.post("/detach-patient-from-professional", removePatientFromProfessional);
router.get("/get-professionals-by-status/:status", getProfessionalsByStatus);
router.get(
    "/get-professionals-of-patient/:patientId",
    getProfessionalsOfPatient
);
router.get(
    "/get-professionals-by-department/:department",
    getProfessionalsByDepartment
);
router.get(
    "/get-professionals-by-status-and-department/:status/:department",
    getProfessionalsByStatusAndDepartment
);
router.get("/search-professional/:key", searchProfessional);
router.get(
    "/get-patients-of-professional/:professionalId",
    getPatientsOfProfessional
);
router.get("/get-professional-by-user-id/:userId", getProfessionalByUserId);

module.exports = router;
