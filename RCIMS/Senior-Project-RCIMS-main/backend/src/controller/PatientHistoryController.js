const  PatientHistory = require ("../models/PatientHistory");
const  Patient = require ("../models/Patient");
const User = require ("../models/User");
const pdfService = require("../service/pdf-service");
const Appointment = require("../models/Appointment");
const Professional = require ("../models/Professional");

// API - Add a new patient history
const addPatientHistory = async (req, res) => {
    try {
        const { patientId, professionalId, historyData } = req.body;
        const patientHistory = await PatientHistory.create({
            patient: patientId,
            professional: professionalId,
            historyData,
        });
        const savedPatientHistory = await patientHistory.save();
        res.status(201).json({
            message: "Patient history added successfully",
            patientHistory: savedPatientHistory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding patient history",
            error: error.message,
        });
    }
};

// API - Get patient history by patient ID
const getPatientHistoryByPatientId = async (req, res) => {
    try {
        let { patientId } = req.params;
        // Find patient with the id
        let patient = await Patient.findById(patientId);
        // Check if patient exists
        if(!patient) {
            const user = await User.findById(patientId);
            if(!user) {
              return res.status(404).json({
                message: "Patient not found"
              });
            } else {
                patient = await Patient.findOne({ user: patientId });
                patientId = patient._id;
            }
        }
        const patientHistory = await PatientHistory.find({ patient: patientId })
            .populate({
                path: 'professional',
                populate: {
                    path: 'user',
                    select: 'name fatherName grandfatherName'
                }
            });

        const formattedPatientHistory = patientHistory.map(history => ({
            ...history.toObject(),
            professionalName: `${history.professional.user.name} ${history.professional.user.fatherName} ${history.professional.user.grandfatherName}`,
            professional: history.professional._id // Keep only the ID
        }));

        res.status(200).json({
            message: "Patient history fetched successfully",
            patientHistory: formattedPatientHistory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching patient history",
            error: error.message,
        });
    }
};

// API - Get the latest patient history
const getLatestPatientHistory = async (req, res) => {
    try {
        let { patientId } = req.params;
        // Find patient with the id
        let patient = await Patient.findById(patientId);
        // Check if patient exists
        if(!patient) {
            const user = await User.findById(patientId);
            if(!user) {
              return res.status(404).json({
                message: "Patient not found"
              });
            } else {
                patient = await Patient.findOne({ user: patientId });
                patientId = patient._id;
            }
        }
        const patientHistory = await PatientHistory.findOne({ patient: patientId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'professional',
                populate: {
                    path: 'user',
                    select: 'name fatherName grandfatherName'
                }
            });

        if (!patientHistory) {
            return res.status(404).json({
                message: "No patient history found"
            });
        }

        const formattedPatientHistory = {
            ...patientHistory.toObject(),
            professionalName: `${patientHistory.professional.user.name} ${patientHistory.professional.user.fatherName} ${patientHistory.professional.user.grandfatherName}`,
            professional: patientHistory.professional._id // Keep only the ID
        };

        res.status(200).json({
            message: "Latest patient history fetched successfully",
            patientHistory: formattedPatientHistory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching latest patient history",
            error: error.message,
        });
    }
};

// Local function - generate complete history data
const generateCompleteHistoryData = async (patientId) => {
    try{
        const patient = await Patient.findById(patientId).populate("user", "name fatherName grandfatherName phoneNumber");
        // Total number of appointments
        const appointments = await Appointment.countDocuments({ patientId: patientId });
        // Total number of appointments remaining
        const remainingAppointments = await Appointment.countDocuments({ patientId: patientId, status: "active" });
        // Number of professionals assigned
        const numberOfProfessionals = patient.assignedProfessionals.length;
        // Details of professionals assigned
        const professionals = await Professional.find({ _id: { $in: patient.assignedProfessionals } }).populate("user", "name fatherName grandfatherName phoneNumber");
        // Get the patient history
        const patientHistory = await PatientHistory.find({ patient: patientId })
    .populate({
        path: 'professional',
        populate: {
            path: 'user',
            select: 'name fatherName grandfatherName'
        }
    });
        return { appointments, remainingAppointments, numberOfProfessionals, professionals, patientHistory, patient };

    }catch(error){
        console.log(error);
    }
};

// API - Generate PDF for patient history
const exportPdf = async (req, res) => {
    try {
        const { userId } = req.params;
        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const patientId = patient._id;
        const data = await generateCompleteHistoryData(patientId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=patient-history.pdf');

        const pdfBuffer = await new Promise((resolve, reject) => {
            let buffers = [];
            pdfService.buildPdf(
                (chunk) => buffers.push(chunk),
                () => resolve(Buffer.concat(buffers)),
                data
            );
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Error generating PDF", error: error.message });
    }
};

module.exports = {
    addPatientHistory,
    getPatientHistoryByPatientId,
    getLatestPatientHistory,
    exportPdf,
};
