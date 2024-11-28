const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["active", "read"],
        default: "active",
    },
    type: {
        type: String,
        enum: ["complaint", "suggestion", "gratitude", "other"],
        required: true,
    },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;