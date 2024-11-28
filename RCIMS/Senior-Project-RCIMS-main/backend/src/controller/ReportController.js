const User = require("../models/User");
const Professional = require("../models/Professional");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

// Stats for admin dashboard
async function userStats(req, res) {
    try {
        // Get total number of patients
        const totalPatients = await Patient.countDocuments({});
        // Get total number of professionals
        const totalProfessionals = await Professional.countDocuments({});
        // Get total number of male patients who are active
        const totalMalePatients = await User.aggregate([
            {
                $match: {
                    role: "patient",
                    gender: "male"
                }
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "_id",
                    foreignField: "user",
                    as: "patientInfo"
                }
            },
            {
                $match: {
                    "patientInfo.status": "Active"
                }
            },
            {
                $count: "count"
            }
        ]);

        const malePatientCount = totalMalePatients[0] ? totalMalePatients[0].count : 0;
        // Get total number of female patients who are active
        const totalFemalePatients = await User.aggregate([
            {
                $match: {
                    role: "patient",
                    gender: "female"
                }
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "_id",
                    foreignField: "user",
                    as: "patientInfo"
                }
            },
            {
                $match: {
                    "patientInfo.status": "Active"
                }
            },
            {
                $count: "count"
            }
        ]);

        const femalePatientCount = totalFemalePatients[0] ? totalFemalePatients[0].count : 0;
        
        // Get total number of discharged patients
        const totalDischargedPatients = await Patient.countDocuments({
            status: "Discharged",
        });
        // Get total number of In-patients
        const totalInpatients = await Patient.countDocuments({
            patientType: "In-patient",
            status: "Active",
        });
        // Get total number of Out-patients
        const totalOutpatients = await Patient.countDocuments({
            patientType: "Out-patient",
            status: "Active",
        });
        res.status(200).json({
            totalPatients,
            totalProfessionals,
            malePatientCount,
            femalePatientCount,
            totalDischargedPatients,
            totalInpatients,
            totalOutpatients,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get patient stats! Please try again.",
        });
        console.log(error);
    }
}

async function appointmentStats(req, res) {
    try {
        // Get total number of active appointments
        const totalAppointments = await Appointment.countDocuments({
            status: "active",
        });
        // Get total number of appointments for today
        const today = new Date();
        const todayAppointments = await Appointment.countDocuments({
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            status: "active",
        });
        // Get total number of appointments
        const totalAppointmentsToDate = await Appointment.countDocuments();
        res.status(200).json({
            totalAppointments,
            todayAppointments,
            totalAppointmentsToDate,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get appointment stats! Please try again.",
        });
        console.log(error);
    }
}

// Stats for professional dashboard
async function statsForProfessional(req, res) {
    try {
        const params = req.params;
        const professional = await Professional.findOne({ user: params.userId });
        // Get the number of patients assigned to a professional
        const numberOfPatients = professional.numberOfPatients;
        // Get the number of appointments for a professional
        const numberOfAppointments = await Appointment.countDocuments({
            professionalId: professional._id,
            status: "active",
        });
        // Get the number of appointments for a professional for today
        const today = new Date();
        const todayAppointments = await Appointment.countDocuments({
            professionalId: professional._id,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            status: "active",
        });
        // Get number of inpatients for a professional
        const numberOfInpatients = await Patient.countDocuments({
            assignedProfessionals: professional._id,
            patientType: "In-patient",
            status: "Active",
        });
        // Get number of outpatients for a professional
        const numberOfOutpatients = await Patient.countDocuments({
            assignedProfessional: professional._id,
            patientType: "Out-patient",
            status: "Active",
        });

        res.status(200).json({
            numberOfPatients,
            numberOfAppointments,
            todayAppointments,
            numberOfInpatients,
            numberOfOutpatients,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get professional stats! Please try again.",
        });
        console.log(error);
    }
}

// Stats for patient dashboard
async function statsForPatient(req, res) {
    try {
        const params = req.params;
        const patient = await Patient.findOne({ user: params.userId });
        // Get number of appointments for a patient
        const numberOfAppointments = await Appointment.countDocuments({
            patientId: patient._id,
            status: "active",
        });
        // Get number of appointments for a patient for today
        const today = new Date();
        const todayAppointments = await Appointment.countDocuments({
            patientId: patient._id,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            status: "active",
        });
        // Get number of assigned professionals for a patient
        const numberOfAssignedProfessionals =
            patient.assignedProfessionals.length;
        // Get assigned professional names
        const assignedProfessionals = await Professional.find(
            { _id: { $in: patient.assignedProfessionals } }
        ).populate("user", "name fatherName grandFatherName phoneNumber");

        res.status(200).json({
            numberOfAppointments,
            todayAppointments,
            numberOfAssignedProfessionals,
            assignedProfessionals,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get patient stats! Please try again.",
        });
        console.log(error);
    }
}

module.exports = {
    userStats,
    appointmentStats,
    statsForProfessional,
    statsForPatient,
};
