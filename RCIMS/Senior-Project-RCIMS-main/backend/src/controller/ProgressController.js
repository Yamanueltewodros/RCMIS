const ProgressData = require('../models/ProgressData');

// Helper function - calculate BMI
function calculateBMI(height, weight) {
    return weight / (height * height);
}

// Helper function - calculate ASI Category
function calculateASICategory(asiScore) {
    return asiScore >= 8 ? "extreme" : asiScore >= 6 ? "considerable" : asiScore >= 4 ? "moderate" : asiScore >= 2 ? "slight" : asiScore >=0 ? "slight": "invalid";
}

async function addProgress(req, res) {
    try {
        const newProgress = new ProgressData(req.body);
        newProgress.height = newProgress.height / 100;
        newProgress.bmi = calculateBMI(newProgress.height, newProgress.weight);
        newProgress.asiCategory = calculateASICategory(newProgress.asiScore);
        const savedProgress = await newProgress.save();
        res.status(201).json(savedProgress);
    } catch (error) {
        res.status(400).json({ message: "Failed to add progress! Please try again." });
        console.log(error);
    }
}

async function getAllProgress(req, res) {
    try {
        const patientId = req.params.patientId;
        const progress = await ProgressData.find({ patient: patientId }).sort({ createdAt: -1 });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: "Failed to get progress! Please try again." });
        console.log(error);
    }
}

async function getProgressById(req, res) {
    try {
        const progress = await ProgressData.findById(req.params.id);
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: "Failed to get progress! Please try again." });
        console.log(error);
    }
}

async function editProgress(req, res) {
    try {
        const progress = await ProgressData.findById(req.params.id);
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        // Update fields from request body
        Object.assign(progress, req.body);

        // Update calculated fields
        progress.height = progress.height / 100;
        progress.bmi = calculateBMI(progress.height, progress.weight);
        progress.asiCategory = calculateASICategory(progress.asiScore);

        // Save the updated progress
        const updatedProgress = await progress.save();

        res.status(200).json(updatedProgress);
    } catch (error) {
        console.error("Error editing progress:", error);
        res.status(400).json({ message: "Failed to edit progress. Please try again." });
    }
}

async function deleteProgress(req, res) {
    try {
        const deletedProgress = await ProgressData.findByIdAndDelete(req.params.id);
        if (!deletedProgress) {
            return res.status(404).json({ message: 'Progress not found' });
        }
        res.status(200).json({ message: 'Progress deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete progress! Please try again." });
        console.log(error);
    }
}

module.exports = {
    addProgress,
    getAllProgress,
    getProgressById,
    editProgress,
    deleteProgress
};
