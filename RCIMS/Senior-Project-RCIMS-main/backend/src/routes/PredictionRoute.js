const express = require('express');
const PredictionController = require('../controller/PredictionController');

const router = express.Router();

router.post("/predict/:patientId", PredictionController.getPrediction);
router.get("/latest/:patientId", PredictionController.getLatestPrediction);

module.exports = router;
