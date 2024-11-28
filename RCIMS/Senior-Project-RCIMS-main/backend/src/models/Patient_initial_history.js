const mongoose = require("mongoose");

const patientInitialHistorySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    currentMedicalConditions: {
        type: [String],
        default: [],
    },
    primarySubstance: {
        type: String,
        required: true,
    },
    primarySubstanceMethodOfUse: {
        type: String,
        enum: ["Oral", "Injection", "Inhalation", "Other"],
        required: true,
    },
    secondarySubstances: {
        type: [String],
        default: [],
    },
    pastAddictionTreatment: {
        type: String,
        enum: ["Yes", "No"],
        required: true,
    },
    withdrawalSymptoms: {
        type: String,
        enum: ["Yes", "No"],
        required: true,
    },
    socialSupportNetwork: {
        type: String,
        enum: ["Family", "Friend", "Support Group", "Other", "None"],
        required: true,
    },
    historyOfTraumaOrAbuse: {
        type: String,
        enum: ["Yes", "No", "Unknown"],
        required: true,
    },
});

module.exports = mongoose.model("PatientInitialHistory", patientInitialHistorySchema);
