const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    employmentStatus: {
        type: String,
        required: true,
    },
    educationalLevel: {
        type: String,
        required: true,
    },
    livingSituation: {
        type: String,
        enum: ["Alone", "Family", "Shelter", "Other"],
        required: true,
    },
    patientType: {
        type: String,
        enum: ["In-patient", "Out-patient"],
        required: true,
    },
    roomNumber: {
        type: String,
        required: function () {
            return this.patientType === "In-patient";
        },
    },
    bedNumber: {
        type: String,
        required: function () {
            return this.patientType === "In-patient";
        },
    },
    allergies: {
        type: [String],
        default: [],
    },
    assignedProfessionals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professional",
        },
    ],
    status: {
        type: String,
        enum: ["Active", "Discharged", "Suspended"],
        required: true,
        default: "Active",
    },
});

// Custom validation
patientSchema.pre("validate", function (next) {
    if (this.patientType === "Out-patient") {
        this.roomNumber = undefined;
        this.bedNumber = undefined;
    }
    next();
});

module.exports = mongoose.model("Patient", patientSchema);
