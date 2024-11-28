const mongoose = require("mongoose");

const EngagementSchema = new mongoose.Schema({
    mediaType: {
        type: String,
        enum: ['video', 'image', 'pdf', 'audio', 'document', 'other'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Engagement", EngagementSchema);
