const Engagement = require("../models/Engagement");

const addEngagement = async (req, res) => {
    try {
        const { mediaType, url, description } = req.body;
        const newEngagement = await Engagement.create({ mediaType, url, description });
        const savedEngagement = await newEngagement.save();
        res.status(201).json({
            message: "Engagement added successfully",
            engagement: savedEngagement,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//* API - Get all engagements
const getAllEngagements = async (req, res) => {
    try {
        const engagements = await Engagement.find();
        res.status(200).json(engagements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//* API - delete an engagement
const deleteEngagement = async (req, res) => {
    try {
        const { id } = req.params;
        await Engagement.findByIdAndDelete(id);
        res.status(200).json({ message: "Engagement deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addEngagement,
    getAllEngagements,
    deleteEngagement,
};

