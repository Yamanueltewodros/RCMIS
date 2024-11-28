const express = require("express");
const router = express.Router();
const {
    addProgress,
    getAllProgress,
    getProgressById,
    editProgress,
    deleteProgress,
} = require("../controller/ProgressController");

router.post("/add-progress", addProgress);
router.get("/get-all-progress/:patientId", getAllProgress);
router.get("/get-progress-by-id/:id", getProgressById);
router.put("/edit-progress/:id", editProgress);
router.delete("/delete-progress/:id", deleteProgress);

module.exports = router;
