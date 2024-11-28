const mongoose = require("mongoose");

const patientHistorySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    historyData: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("PatientHistory", patientHistorySchema);
