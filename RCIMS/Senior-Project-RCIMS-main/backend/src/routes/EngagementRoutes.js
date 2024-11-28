const express = require("express");
const { addEngagement, getAllEngagements, deleteEngagement } = require("../controller/EngagementController");

const router = express.Router();

router.post("/add", addEngagement);
router.get("/all", getAllEngagements);
router.delete("/delete/:id", deleteEngagement);

module.exports = router;

