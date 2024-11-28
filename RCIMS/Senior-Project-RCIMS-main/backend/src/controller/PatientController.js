const User = require("../models/User");
const Patient = require("../models/Patient");
const PatientInitialHistory = require("../models/Patient_initial_history");
const PatientHistory = require("../models/PatientHistory");
const Caregiver = require("../models/Caregiver");
const { signupUser, removeUser } = require("./UserController");
const {
    addPatientToProfessionalDefault,
    getProfessionalWithLeastPatientsInDepartment,
} = require("./Patient-Professional-SharedController");
const { addPatientSchedule } = require("./ScheduleController");
const { createEarliestAppointment } = require("./AppointmentController");
const Appointment = require("../models/Appointment");

// API - Add a new patient
const addPatient = async (req, res) => {
    let user;
    let professionals;
    let isolator = 0;
    try {
        user = await signupUser(req, res);
        if (!user) {
            return res.status(400).json({ error: "Failed to create user" });
        }

        isolator = 1;

        // get the basic patient data from the request body
        const {
            employmentStatus,
            educationalLevel,
            livingSituation,
            patientType,
            roomNumber,
            bedNumber,
            allergies,
        } = req.body;

        professionals = await assignProfessional(user._id);

        await addPatientToProfessionalDefault(
            professionals[0],
            user._id,
            patientType
        );
        await addPatientToProfessionalDefault(
            professionals[1],
            user._id,
            patientType
        );

        const newPatient = await Patient.create({
            user: user._id,
            employmentStatus,
            educationalLevel,
            livingSituation,
            patientType,
            roomNumber,
            bedNumber,
            allergies,
            assignedProfessionals: professionals,
        });

        const savedPatient = await newPatient.save();

        // get the patient initial history from the request body
        const {
            currentMedicalConditions,
            primarySubstance,
            primarySubstanceMethodOfUse,
            secondarySubstances,
            pastAddictionTreatment,
            withdrawalSymptoms,
            socialSupportNetwork,
            historyOfTraumaOrAbuse,
        } = req.body;

        const newPatientInitialHistory = await PatientInitialHistory.create({
            patient: savedPatient._id,
            currentMedicalConditions,
            primarySubstance,
            primarySubstanceMethodOfUse,
            secondarySubstances,
            pastAddictionTreatment,
            withdrawalSymptoms,
            socialSupportNetwork,
            historyOfTraumaOrAbuse,
        });

        const savedPatientInitialHistory =
            await newPatientInitialHistory.save();

        await addPatientSchedule(user._id);

        // Create earliest appointment for the patient and professional
        await createEarliestAppointment(professionals[0]._id, savedPatient._id);
        await createEarliestAppointment(professionals[1]._id, savedPatient._id);

        res.status(201).json({
            message: "Patient added successfully",
            patient: savedPatient,
            patientInitialHistory: savedPatientInitialHistory,
        });
    } catch (error) {
        console.error("Error in addPatient:", error);
        if (isolator === 1) {
            removeUser(user._id);
            res.status(500).json({
                message: !professionals
                    ? "Missing professionals to assign patient to."
                    : "Error adding patient",
                error: error.message,
            });
        } else {
            // check if the phone number already exists
            const { phoneNumber } = req.body;
            const existingUser = await User.findOne({ phoneNumber });
            if (existingUser) {
                res.status(400).json({
                    message:
                        "Phone number already exists! Please use a different phone number.",
                });
            } else {
                res.status(500).json({
                    message: "Error creating user",
                    error: error.message,
                });
            }
        }
    }
};

// Local function - assign a professional with the least number of patients - MD and Psycho
const assignProfessional = async (userId) => {
    try {
        const MDprofessional =
            await getProfessionalWithLeastPatientsInDepartment("MD");
        const PsychoProfessional =
            await getProfessionalWithLeastPatientsInDepartment("Psychiatry");

        const professionals = [];

        if (MDprofessional) {
            professionals.push(MDprofessional);
        } else {
            console.log("No MD professional found");
        }

        if (PsychoProfessional) {
            professionals.push(PsychoProfessional);
        } else {
            console.log("No Psycho professional found");
        }

        return professionals;
    } catch (error) {
        // remove the added user if an error occurs
        removeUser(userId);
        console.error("Error in assignProfessional:", error);
        throw error;
    }
};

// API - check if a phone number already exists before adding a new patient
// TODO: change into a local function
const checkPhoneNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.params;
        const existingUser = await User.findOne({ phoneNumber });
        res.json({ exists: !!existingUser });
    } catch (error) {
        console.error("Error in checkPhoneNumber:", error);
        res.status(500).json({
            message: "Error checking phone number",
            error: error.message,
        });
    }
};

// API - get all patients
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate("user", "-password");
        res.json(patients);
    } catch (error) {
        console.error("Error in getAllPatients:", error);
        res.status(500).json({
            message: "Error getting patients",
            error: error.message,
        });
    }
};

// API - get a patient by id
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id).populate(
            "user",
            "-password"
        );
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json({ patient });
    } catch (error) {
        console.error("Error in getPatientById:", error);
        res.status(500).json({
            message: "Error getting patient by id",
            error: error.message,
        });
    }
};

// API - Update user data
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;

        let {
            // User fields
            name,
            fatherName,
            grandfatherName,
            phoneNumber,
            dateOfBirth,
            gender,
            address,
            // Patient fields
            employmentStatus,
            educationalLevel,
            livingSituation,
            patientType,
            roomNumber,
            bedNumber,
            allergies,
            status,
        } = req.body;

        // If patient type is "Out-patient", set roomNumber and bedNumber to null
        if (patientType === "Out-patient") {
            roomNumber = null;
            bedNumber = null;
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            {
                employmentStatus,
                educationalLevel,
                livingSituation,
                patientType,
                roomNumber,
                bedNumber,
                allergies,
                status,
            },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            console.log("Patient not found");
            return res.status(404).json({ message: "Patient not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            updatedPatient.user,
            {
                name,
                fatherName,
                grandfatherName,
                phoneNumber,
                dateOfBirth,
                gender,
                address,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            console.log("Related user not found");
            return res.status(404).json({ message: "Related user not found" });
        }

        res.status(200).json({
            message: "Patient and related user updated successfully",
            patient: updatedPatient,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in updatePatient:", error);
        res.status(500).json({
            message: "Error updating patient",
            error: error.message,
        });
    }
};

// API - Attach a professional to a patient
const attachProfessional = async (req, res) => {
    try {
        const { patientId, department } = req.body;
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const professional = await getProfessionalWithLeastPatientsInDepartment(
            department
        );
        if (!professional) {
            return res.status(404).json({ message: "Professional not found" });
        }
        patient.assignedProfessionals.push(professional);
        await patient.save();
        res.status(200).json({
            message: "Professional attached to patient successfully",
        });
    } catch (error) {
        console.error("Error in attachProfessionalToPatient:", error);
        res.status(500).json({
            message: "Error attaching professional to patient",
            error: error.message,
        });
    }
};

// API - Delete a patient
const dischargePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Make sure the patient has no assigned professionals
        if (patient.assignedProfessionals.length > 0) {
            return res.status(400).json({
                message:
                    "All assigned professionals must be detached before discharging the patient",
            });
        }

        // Change the status of the patient to "Discharged"
        patient.status = "Discharged";
        await patient.save();

        res.status(200).json({ message: "Patient discharged successfully" });
    } catch (error) {
        console.error("Error in dischargePatient:", error);
        res.status(500).json({
            message: "Error discharging patient",
            error: error.message,
        });
    }
};

// API - Get patients by status - For filtering
const getPatientsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const patients = await Patient.find({ status });
        res.json(patients);
    } catch (error) {
        console.error("Error in getPatientsByStatus:", error);
        res.status(500).json({
            message: "Error getting patients by status",
            error: error.message,
        });
    }
};

// API - search patient by name or phone number
const searchPatient = async (req, res) => {
    try {
        const { key } = req.params;
        const patients = await Patient.find()
            .populate({
                path: "user",
                match: {
                    $or: [
                        { name: { $regex: key, $options: "i" } },
                        { phoneNumber: { $regex: key, $options: "i" } },
                    ],
                },
                select: "-password",
            })
            .exec();

        // Filter out patients where user is null (didn't match the criteria)
        const filteredPatients = patients.filter(
            (patient) => patient.user !== null
        );
        res.json(filteredPatients);
    } catch (error) {
        console.error("Error in searchPatient:", error);
        res.status(500).json({
            message: "Error searching patient",
            error: error.message,
        });
    }
};

// API - Get all of patient's information
const getPatientInformation = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id).populate(
            "user",
            "-password"
        );
        const patientHistory = await PatientHistory.find({ patient: id });
        const caregiver = await Caregiver.find({ patient: id });
        res.json({ patient, patientHistory, caregiver });
    } catch (error) {
        console.error("Error in getPatientInformation:", error);
        res.status(500).json({
            message: "Error getting patient information",
            error: error.message,
        });
    }
};

//* API - get patients to discharge list
const getPatientsToDischarge = async (req, res) => {
    try {
        // Find patients with no assigned professionals and active status
        const patientsWithNoAssignedProfessionals = await Patient.find({
            assignedProfessionals: { $size: 0 },
            status: "Active",
        }).populate("user", "-password");

        // Get patient IDs
        const patientIds = patientsWithNoAssignedProfessionals.map(
            (patient) => patient._id
        );

        // Find active appointments for these patients
        const activeAppointments = await Appointment.find({
            patientId: { $in: patientIds },
            status: "active",
        });

        // Filter out patients with active appointments
        const patientsToDischarge = patientsWithNoAssignedProfessionals.filter(
            (patient) =>
                !activeAppointments.some((appointment) =>
                    appointment.patientId.equals(patient._id)
                )
        );

        res.status(200).json({
            message: "Patients ready for discharge retrieved successfully",
            patients: patientsToDischarge,
        });
    } catch (error) {
        console.error("Error in getPatientsToDischarge:", error);
        res.status(500).json({
            message: "Error getting patients to discharge",
            error: error.message,
        });
    }
};

module.exports = {
    addPatient,
    checkPhoneNumber,
    getPatients,
    getPatientById,
    updatePatient,
    dischargePatient,
    attachProfessional,
    getPatientsByStatus,
    searchPatient,
    getPatientInformation,
    getPatientsToDischarge,
};
