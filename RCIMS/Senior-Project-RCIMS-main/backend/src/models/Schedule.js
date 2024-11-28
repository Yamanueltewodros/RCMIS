const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    currentWeek: [
        {
            date: {
                type: String,
                required: true,
            },
            sessionNumber: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                required: true,
                enum: ["physical", "group", "isolated"],
            },
            status: {
                type: String,
                required: true,
                enum: ["available", "booked", "unavailable"],
            },
        },
    ],

    nextWeek: [
        {
            date: {
                type: String,
                required: true,
            },
            sessionNumber: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                required: true,
                enum: ["physical", "group", "isolated"],
            },
            status: {
                type: String,
                required: true,
                enum: ["available", "booked", "unavailable"],
            },
        },
    ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
