const express = require("express");
const router = express.Router();
const {
    addFeedback,
    getAllFeedbacks,
    getFeedbackById,
} = require("../controller/FeedbackController");

router.post("/add-feedback", addFeedback);
router.get("/get-all-feedbacks", getAllFeedbacks);
router.get("/get-feedback/:id", getFeedbackById);

module.exports = router;
