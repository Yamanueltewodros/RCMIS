const Patient = require("../models/Patient");
const Professional = require("../models/Professional");
const Appointment = require("../models/Appointment");

// Local function - get professional from a specific department with the least number of patients
const getProfessionalWithLeastPatientsInDepartment = async (department) => {
    try {
        const professional = await Professional.findOne({
            department,
            status: "active",
        }).sort({ numberOfPatients: 1 });
        if (!professional) {
            throw new Error("Professional not found");
        }
        return professional._id;
    } catch (error) {
        console.log("Professional with the specified department not found");
        throw error;
    }
};

// Local function - Add patient to professional
const addPatientToProfessionalDefault = async (
    professionalId,
    patientId,
    patientType
) => {
    const professional = await Professional.findById(professionalId);
    professional.patients.push(patientId);
    professional.numberOfPatients++;
    if (patientType === "In-patient") {
        professional.numberOfInPatients++;
    } else {
        professional.numberOfOutPatients++;
    }
    await professional.save();
};

// Local function - Remove professional from patient
const detatchProfessionalFromPatient = async (professionalId, patientId) => {
    const professional = await Professional.findById(professionalId);
    const patient = await Patient.findById(patientId);

    if (!professional || !patient) {
        throw new Error("Professional or Patient not found");
    }

    //check if the professional has any active appointments with the patient
    const activeAppointments = await Appointment.find({
        professionalId,
        patientId,
        status: "active",
    });

    if (activeAppointments.length > 0) {
        throw new Error(
            "Professional has active appointments with the patient"
        );
    }

    professional.patients.pull(patient.user);
    professional.numberOfPatients = Math.max(
        0,
        professional.numberOfPatients - 1
    );
    // check if the patient is an inpatient or outpatient
    if (patient.patientType === "In-patient") {
        professional.numberOfInPatients = Math.max(
            0,
            professional.numberOfInPatients - 1
        );
    } else {
        professional.numberOfOutPatients = Math.max(
            0,
            professional.numberOfOutPatients - 1
        );
    }

    await professional.save();

    patient.assignedProfessionals.pull(professionalId);

    await patient.save();

    return { success: true };
};

module.exports = {
    getProfessionalWithLeastPatientsInDepartment,
    addPatientToProfessionalDefault,
    detatchProfessionalFromPatient,
};
