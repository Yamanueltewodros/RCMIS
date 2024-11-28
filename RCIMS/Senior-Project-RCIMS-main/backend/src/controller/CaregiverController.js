const Caregiver = require("../models/Caregiver");

//* API - Add a new caregiver
const addCaregiver = async (req, res) => {
    try {
        // Add the caregiver to a specific patient
        const { patientId, fullName, phoneNumber, relationshipToPatient, gender, address, officialIdNumber } = req.body;

        // Check if the patient already has a caregiver
        const caregiver = await Caregiver.findOne({ patient: patientId });
        if (caregiver) {
            return res.status(400).json({
                message: "Patient already has a caregiver",
            });
        }

        const newCaregiver = await Caregiver.create({
            patient: patientId,
            fullName,
            phoneNumber,
            relationshipToPatient,
            gender,
            address,
            officialIdNumber,
        });

        const savedCaregiver = await newCaregiver.save();

        res.status(201).json({
            message: "Caregiver added successfully",
            caregiver: savedCaregiver,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding caregiver",
            error: error.message,
        });
    }
};

//* API - Get a caregiver by patient ID
const getCaregiverByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        const caregiver = await Caregiver.findOne({ patient: patientId, });
        
        res.status(200).json({
            message: "Caregiver fetched successfully",
            caregiver: caregiver,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching caregiver",
            error: error.message,
        });
    }
};

//* API - Update a caregiver
const updateCaregiver = async (req, res) => {
    try {
        const { caregiverId } = req.params;
        
        const caregiver = await Caregiver.findById(caregiverId);
        
        if (!caregiver) {
            return res.status(404).json({ message: "Caregiver not found" });
        }

        const { fullName, phoneNumber, relationshipToPatient, gender, address, officialIdNumber } = req.body;
        caregiver.fullName = fullName;
        caregiver.phoneNumber = phoneNumber;
        caregiver.relationshipToPatient = relationshipToPatient;
        caregiver.gender = gender;
        caregiver.address = address;
        caregiver.officialIdNumber = officialIdNumber;

        const updatedCaregiver = await caregiver.save();
        res.status(200).json({
            message: "Caregiver updated successfully",
            caregiver: updatedCaregiver,
        });
    } catch (error) {
        console.error('Error updating caregiver:', error);
        res.status(500).json({
            message: "Error updating caregiver",
            error: error.message,
        });
    }
};

//* API - Delete a caregiver
const deleteCaregiver = async (req, res) => {
    try {
        const { caregiverId } = req.params;
        const caregiver = await Caregiver.findById(caregiverId);
        if (!caregiver) {
            return res.status(404).json({ message: "Caregiver not found" });
        }
        await caregiver.deleteOne();
        res.status(200).json({
            message: "Caregiver deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting caregiver",
            error: error.message,
        });
    }
};


module.exports = {
    addCaregiver,
    getCaregiverByPatientId,
    updateCaregiver,
    deleteCaregiver,
};