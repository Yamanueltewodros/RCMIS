const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    relationshipToPatient: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    officialIdNumber: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Caregiver", caregiverSchema);
