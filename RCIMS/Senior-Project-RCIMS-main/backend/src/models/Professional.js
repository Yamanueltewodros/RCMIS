const mongoose = require("../configuration/dbConfig");

const professionalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    // Add professional details
    // Professional is extended from User schema
    qualification: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["isolated", "group", "physical"],
    },
    bio: {
        type: String,
        required: false,
    },
    languagesSpoken: {
        type: [String],
        required: true,
    },
    workingHours: {
        type: String,
        required: true,
    },
    numberOfPatients: {
        type: Number,
        default: 0,
    },
    patients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: false,
        },
    ],
    numberOfOutPatients: {
        type: Number,
        default: 0,
    },
    numberOfInPatients: {
        type: Number,
        default: 0,
    },
    numberOfAppointments: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "suspended", "terminated"],
        default: "active",
    },
    //! Add professional photo
});

module.exports = mongoose.model("Professional", professionalSchema);
