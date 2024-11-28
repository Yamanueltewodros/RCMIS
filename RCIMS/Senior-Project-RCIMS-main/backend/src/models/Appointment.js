const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["physical", "group", "isolated"],
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    patientSession: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule",
            required: true,
        },
    ],
    professionalSession: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule",
            required: true,
        },
    ],
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true,
    },
    sessionNumber: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        default: 1,
    },
    startTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "passed"],
        default: "active",
    },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
