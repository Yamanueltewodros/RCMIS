const User = require("../models/User");
const Professional = require("../models/Professional");
const Patient = require("../models/Patient");
const { signupUser } = require("./UserController");
const {
    detatchProfessionalFromPatient,
    getProfessionalWithLeastPatientsInDepartment,
} = require("./Patient-Professional-SharedController");

const { addProfessionalSchedule } = require("./ScheduleController");
const { createEarliestAppointment } = require("./AppointmentController");

// API - add a new professional
const addProfessional = async (req, res) => {
    try {
        const user = await signupUser(req, res);

        if (!user) {
            return res.status(400).json({ error: "Failed to create user" });
        }

        if (!user._id) {
            return res
                .status(400)
                .json({ error: "User created but _id is missing" });
        }

        const {
            qualification,
            speciality,
            licenseNumber,
            yearsOfExperience,
            department,
            type,
            bio,
            languagesSpoken,
            workingHours,
        } = req.body;

        const newProfessional = new Professional({
            user: user._id,
            qualification,
            speciality,
            licenseNumber,
            yearsOfExperience,
            department,
            type,
            bio,
            languagesSpoken,
            workingHours,
        });

        const savedProfessional = await newProfessional.save();
        await addProfessionalSchedule(user._id);

        res.status(201).json({
            message: "Professional added successfully",
            professional: savedProfessional,
        });
    } catch (error) {
        console.error("Error in addProfessional:", error);
        res.status(500).json({
            message: "Error adding professional",
            error: error.message,
        });
    }
};

// API - get all professionals
const getProfessionals = async (req, res) => {
    try {
        const professionals = await Professional.find().populate(
            "user",
            "-password"
        );
        res.status(200).json({ professionals });
    } catch (error) {
        console.error("Error in getProfessionals:", error);
        res.status(500).json({
            message: "Error getting professionals",
            error: error.message,
        });
    }
};

// API - get a professional by id
const getProfessionalById = async (req, res) => {
    try {
        const { id } = req.params;
        const professional = await Professional.findById(id).populate(
            "user",
            "-password"
        );
        if (!professional) {
            return res.status(404).json({ message: "Professional not found" });
        }
        res.status(200).json({ professional });
    } catch (error) {
        console.error("Error in getProfessionalById:", error);
        res.status(500).json({
            message: "Error getting professional by id",
            error: error.message,
        });
    }
};

// API - Attach a patient to a professional
const attachPatient = async (req, res) => {
    try {
        let { professionalId, patientId, department } = req.body;

        // if professionalID is null, attach the patient to the professional with the least number of patients
        if (!professionalId) {
            let professional =
                await getProfessionalWithLeastPatientsInDepartment(department);
            professionalId = professional._id;
        }

        const professional = await Professional.findById(professionalId);
        const patient = await Patient.findById(patientId);

        professional.patients.push(patientId);
        professional.numberOfPatients++;
        await professional.save();

        patient.assignedProfessionals.push(professionalId);
        await patient.save();

        await createEarliestAppointment(professionalId, patientId);

        res.status(200).json({
            message: "Patient attached to professional successfully",
            professional: professional,
            patient: patient,
        });
    } catch (error) {
        console.error("Error in attachPatientToProfessional:", error);
        res.status(500).json({
            message: "Error attaching patient to professional",
            error: error.message,
        });
    }
};

// API - update a professional
const updateProfessional = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            // Professional fields
            qualification,
            speciality,
            licenseNumber,
            yearsOfExperience,
            department,
            bio,
            languagesSpoken,
            workingHours,
            status,
            // User fields
            name,
            fatherName,
            grandfatherName,
            phoneNumber,
            dateOfBirth,
            gender,
            address,
        } = req.body;

        // Update Professional
        const updatedProfessional = await Professional.findByIdAndUpdate(
            id,
            {
                $set: {
                    qualification,
                    speciality,
                    licenseNumber,
                    yearsOfExperience,
                    department,
                    bio,
                    languagesSpoken,
                    workingHours,
                    status,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedProfessional) {
            return res.status(404).json({ message: "Professional not found" });
        }

        // Check if phone number is being changed
        const existingUser = await User.findById(updatedProfessional.user);
        if (existingUser.phoneNumber !== phoneNumber) {
            // Check if the new phone number already exists
            const phoneExists = await User.findOne({ phoneNumber });
            if (phoneExists) {
                return res
                    .status(400)
                    .json({ message: "Phone number already in use" });
            }
        }

        // Update related User
        const updatedUser = await User.findByIdAndUpdate(
            updatedProfessional.user,
            {
                $set: {
                    name,
                    fatherName,
                    grandfatherName,
                    phoneNumber,
                    dateOfBirth,
                    gender,
                    address,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Related user not found" });
        }

        res.status(200).json({
            message: "Professional and related user updated successfully",
            professional: updatedProfessional,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in updateProfessional:", error);
        res.status(500).json({
            message: "Error updating professional",
            error: error.message,
        });
    }
};

// API - delete a professional
//! change to deactivate the professional instead of deleting
const deleteProfessional = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the professional
        const professional = await Professional.findById(id);
        if (!professional) {
            return res.status(404).json({ message: "Professional not found" });
        }

        // Delete the professional
        await Professional.findByIdAndDelete(id);

        // Delete the related user
        await User.findByIdAndDelete(professional.user);

        res.status(200).json({
            message: "Professional and related user deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteProfessional:", error);
        res.status(500).json({
            message: "Error deleting professional",
            error: error.message,
        });
    }
};

// API - check if a phone number already exists before adding a new professional

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

// API - Remove patient from professional
// This function is used to remove a patient from a professional once the patient has completed the treatment with the professional
// Pass the professionalId and patientId in the body
const removePatientFromProfessional = async (req, res) => {
    const { professionalId, patientId } = req.body;

    if (!professionalId || !patientId) {
        return res.status(400).json({
            message: "Professional ID and Patient ID are required",
        });
    }

    try {
        await detatchProfessionalFromPatient(professionalId, patientId);
        return res.status(200).json({
            message: "Patient detached from professional successfully",
        });
    } catch (error) {
        if (
            error.message ===
            "Professional has active appointments with the patient"
        ) {
            return res.status(400).json({
                message:
                    "Cannot remove patient. There are active appointments.",
                error: error.message,
            });
        }

        if (error.message === "Professional or Patient not found") {
            return res.status(404).json({
                message: "Professional or Patient not found",
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Error removing patient from professional",
            error: error.message,
        });
    }
};

// API - Get professionals by status - For filtering
const getProfessionalsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const professionals = await Professional.find({ status });
        res.json(professionals);
    } catch (error) {
        console.error("Error in getProfessionalsByStatus:", error);
        res.status(500).json({
            message: "Error getting professionals by status",
            error: error.message,
        });
    }
};

// API - Get professionals of a patient
const getProfessionalsOfPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await Patient.findById(patientId);
        const professionals = await Professional.find({
            patients: patient.user,
        });
        res.json(professionals);
    } catch (error) {
        console.error("Error in getProfessionalsOfPatient:", error);
        res.status(500).json({
            message: "Error getting professionals of patient",
            error: error.message,
        });
    }
};
// API - Get professionals by department - For filtering
const getProfessionalsByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const professionals = await Professional.find({ department });
        res.json(professionals);
    } catch (error) {
        console.error("Error in getProfessionalsByDepartment:", error);
        res.status(500).json({
            message: "Error getting professionals by department",
            error: error.message,
        });
    }
};

// API - Get professionals by status and department - For filtering
//! Method not working properly - needs fix
const getProfessionalsByStatusAndDepartment = async (req, res) => {
    try {
        const { status, department } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (department) filter.department = department;

        const professionals = await Professional.find(filter);
        res.json(professionals);
    } catch (error) {
        console.error("Error in getProfessionalsByStatusAndDepartment:", error);
        res.status(500).json({
            message: "Error getting professionals by status and department",
            error: error.message,
        });
    }
};

// API - search professional by name or phone number
const searchProfessional = async (req, res) => {
    try {
        const { key } = req.params;

        const professionals = await Professional.find()
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

        // Filter out professionals where user is null (didn't match the criteria)
        const filteredProfessionals = professionals.filter(
            (prof) => prof.user !== null
        );

        res.json(filteredProfessionals);
    } catch (error) {
        console.error("Error in searchProfessional:", error);
        res.status(500).json({
            message: "Error searching professional",
            error: error.message,
        });
    }
};

// API - Get all the patients of a professional
const getPatientsOfProfessional = async (req, res) => {
    try {
        const { professionalId } = req.params;

        // Find all patients that have the professionalId in their assignedProfessionals array
        // and populate the user field
        const patients = await Patient.find({
            assignedProfessionals: professionalId,
        }).populate("user", "-password"); // Populate user data, excluding the password field

        res.json(patients);
    } catch (error) {
        console.error("Error in getPatientsOfProfessional:", error);
        res.status(500).json({
            message: "Error getting patients of professional",
            error: error.message,
        });
    }
};
// API - get professional with the given user id
const getProfessionalByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const professional = await Professional.find({ user: userId });
        res.status(200).json({ professional });
    } catch (error) {
        console.error("Error in getProfessionalByUserId:", error);
        res.status(500).json({
            message: "Error getting professional by user id",
            error: error.message,
        });
    }
};

// TODO: add a max number of patients a professional can have
// TODO: add patient to the professional only if the professional has less than the maximum number of patients

module.exports = {
    addProfessional,
    getProfessionals,
    updateProfessional,
    deleteProfessional,
    getProfessionalById,
    checkPhoneNumber,
    attachPatient,
    removePatientFromProfessional,
    getProfessionalsByStatus,
    getProfessionalsOfPatient,
    getProfessionalsByDepartment,
    getProfessionalsByStatusAndDepartment,
    searchProfessional,
    getPatientsOfProfessional,
    getProfessionalByUserId,
};
