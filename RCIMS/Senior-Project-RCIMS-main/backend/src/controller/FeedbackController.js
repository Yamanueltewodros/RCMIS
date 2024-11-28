const Feedback = require("../models/Feedback");

// Add a new feedback
const addFeedback = async (req, res) => {
    try {
        const { sender, message, type } = req.body;

        // Validate required fields
        if (!sender || !message || !type) {
            return res.status(400).json({
                message:
                    "Missing required fields: sender, message, and type are required",
            });
        }

        // Validate type
        const validTypes = ["complaint", "suggestion", "gratitude", "other"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                message:
                    "Invalid feedback type. Must be one of: complaint, suggestion, gratitude, or other",
            });
        }

        const newFeedback = await Feedback.create({
            sender,
            message,
            type,
        });

        const savedFeedback = await newFeedback.save();
        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback: savedFeedback,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error submitting feedback",
            error: error.message,
        });
    }
};

// Get all feedbacks, sorted by date (newest first)
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .sort({ date: -1 })
            .populate("sender", "name fatherName grandfatherName phoneNumber");

        const formattedFeedbacks = feedbacks.map((feedback) => ({
            ...feedback.toObject(),
            date: feedback.date.toUTCString(),
        }));

        res.status(200).json(formattedFeedbacks);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching feedbacks",
            error: error.message,
        });
    }
};

// Update feedback status
const updateFeedbackStatus = async (id, status) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedFeedback) {
      throw new Error("Feedback not found");
    }

    return {
      message: "Feedback status updated successfully",
      feedback: updatedFeedback,
    };
  } catch (error) {
    throw new Error(`Error updating feedback status: ${error.message}`);
  }
};
// Get feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id).populate(
            "sender",
            "name fatherName grandfatherName phoneNumber"
        );

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        const formattedFeedback = {
            ...feedback.toObject(),
            date: feedback.date.toUTCString(),
        };

        await updateFeedbackStatus(id, "read");

        res.status(200).json(formattedFeedback);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching feedback",
            error: error.message,
        });
    }
};

  module.exports = {
      addFeedback,
      getAllFeedbacks,
      getFeedbackById,
  };
