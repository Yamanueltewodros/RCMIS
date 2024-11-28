const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Professional = require("../models/Professional");
const Schedule = require("../models/Schedule");
const User = require("../models/User");
const { updateAvailabilityBasedOnTime } = require("./ScheduleController");

//* API - get common available sessions for a professional and a patient
const getCommonAvailableSessions = async (req, res) => {
    try {
        const { professionalId, patientId } = req.params;
        const {
            commonAvailableSessionsCurrentWeek,
            commonAvailableSessionsNextWeek,
        } = await commonAvailableSessions(professionalId, patientId);
        res.status(200).json({
            message: "Common available sessions retrieved successfully",
            commonAvailableSessionsCurrentWeek,
            commonAvailableSessionsNextWeek,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving common available sessions",
            error: error.message,
        });
    }
};

//* Helper function - get common available sessions for a professional and a patient
const commonAvailableSessions = async (professionalId, patientId) => {
    const professional = await Professional.findById(professionalId);
    const patient = await Patient.findById(patientId);
    if (!professional || !patient) {
        throw new Error("Professional or patient not found");
    }

    const professionalSchedule = await Schedule.findOne({
        userId: professional.user,
    });
    const patientSchedule = await Schedule.findOne({
        userId: patient.user,
    });

    if (!professionalSchedule || !patientSchedule) {
        throw new Error("Schedule not found");
    }

    const commonAvailableSessionsCurrentWeek = professionalSchedule.currentWeek
        .filter((profSession) => profSession.status === "available")
        .map((profSession) => {
            const matchingPatientSession = patientSchedule.currentWeek.find(
                (patientSession) =>
                    patientSession.sessionNumber ===
                        profSession.sessionNumber &&
                    patientSession.type === profSession.type &&
                    patientSession.status === "available" &&
                    patientSession.date.toString().split("T")[0] ===
                        profSession.date.toString().split("T")[0]
            );
            return matchingPatientSession
                ? {
                      professional: profSession,
                      patient: matchingPatientSession,
                  }
                : null;
        })
        .filter(Boolean);

    const commonAvailableSessionsNextWeek = professionalSchedule.nextWeek
        .filter((profSession) => profSession.status === "available")
        .map((profSession) => {
            const matchingPatientSession = patientSchedule.nextWeek.find(
                (patientSession) =>
                    patientSession.sessionNumber ===
                        profSession.sessionNumber &&
                    patientSession.type === profSession.type &&
                    patientSession.status === "available" &&
                    patientSession.date.toString().split("T")[0] ===
                        profSession.date.toString().split("T")[0]
            );
            return matchingPatientSession
                ? {
                      professional: profSession,
                      patient: matchingPatientSession,
                  }
                : null;
        })
        .filter(Boolean);

    return {
        commonAvailableSessionsCurrentWeek,
        commonAvailableSessionsNextWeek,
    };
};

//* API - Add a isolated appointment
const addIsolatedAppointment = async (req, res) => {
    try {
        const {
            patientSessionId,
            professionalSessionId,
            patientId,
            professionalId,
        } = req.body;

        const appointmentData = await createIsolatedAppointment(
            patientSessionId,
            professionalSessionId,
            patientId,
            professionalId
        );

        // Create the appointment using the returned data
        const savedAppointment = await Appointment.create(appointmentData);

        res.status(201).json({
            message: "Appointment added successfully",
            appointment: savedAppointment,
        });
    } catch (error) {
        console.error("Error in addIsolatedAppointment:", error);
        res.status(500).json({
            message: "Error adding appointment",
            error: error.message,
        });
    }
};

const createIsolatedAppointment = async (
    patientSessionId,
    professionalSessionId,
    patientId,
    professionalId
) => {
    const professional = await Professional.findById(professionalId);
    const patient = await Patient.findById(patientId);

    const professionalSchedule = await Schedule.findOne({
        userId: professional.user,
    });
    const patientSchedule = await Schedule.findOne({
        userId: patient.user,
    });

    if (!professionalSchedule || !patientSchedule) {
        throw new Error("Schedule not found");
    }

    // Find patient session in current week
    let patientSession = patientSchedule.currentWeek.find(
        (session) => session._id.toString() === patientSessionId
    );
    if (!patientSession) {
        // Find session in next week
        patientSession = patientSchedule.nextWeek.find(
            (session) => session._id.toString() === patientSessionId
        );
        if (!patientSession) {
            throw new Error("Patient session not found");
        }
    }

    // Find professional session in current week
    let professionalSession = professionalSchedule.currentWeek.find(
        (session) => session._id.toString() === professionalSessionId
    );
    if (!professionalSession) {
        // Find session in next week
        professionalSession = professionalSchedule.nextWeek.find(
            (session) => session._id.toString() === professionalSessionId
        );
        if (!professionalSession) {
            throw new Error("Professional session not found");
        }
    }

    const sessionDate = patientSession.date;
    const sessionType = patientSession.type;

    // update the status of the sessions
    patientSession.status = "booked";
    professionalSession.status = "booked";

    // Save the parent documents
    await patientSchedule.save();
    await professionalSchedule.save();

    // Increment the number of appointments for the professional
    professional.numberOfAppointments += 1;
    await professional.save();

    const sessionNumber = patientSession.sessionNumber;
    let startTime;
    switch (sessionNumber) {
        case 1:
            startTime = "7:00 AM";
            break;
        case 2:
            startTime = "8:00 AM";
            break;
        case 3:
            startTime = "9:00 AM";
            break;
        case 4:
            startTime = "10:00 AM";
            break;
        case 5:
            startTime = "11:00 AM";
            break;
        case 6:
            startTime = "2:00 PM";
            break;
        case 7:
            startTime = "3:00 PM";
            break;
        case 8:
            startTime = "4:00 PM";
            break;
        default:
            throw new Error("Invalid session number");
    }

    // Instead of creating the appointment, return the appointment object
    return {
        type: sessionType,
        patientId,
        patientSession: [patientSession._id],
        professionalSession: [professionalSession._id],
        professionalId,
        sessionNumber: sessionNumber,
        startTime,
        date: sessionDate,
    };
};

//* API - get all appointments for a user
const getAllAppointmentsForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const professional = await Professional.findOne({ user: userId });
        const patient = await Patient.findOne({ user: userId });
        let appointments;
        if (!professional) {
            appointments = await Appointment.find({
                patientId: patient._id,
                status: "active",
            }).sort({ date: 1 }); // Sort by date in ascending order
        } else {
            appointments = await Appointment.find({
                professionalId: professional._id,
                status: "active",
            }).sort({ date: 1 }); // Sort by date in ascending order
        }

        res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error in getAllAppointmentsForUser:", error);
        res.status(500).json({
            message: "Error fetching appointments",
            error: error.message,
        });
    }
};

//* API - get appointment details
const getAppointmentDetails = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const patient = await Patient.findById(appointment.patientId);
        const professional = await Professional.findById(
            appointment.professionalId
        );
        const patientUser = await User.findById(patient.user);
        const patientName =
            patientUser.name +
            " " +
            patientUser.fatherName +
            " " +
            patientUser.grandfatherName;
        const patientType = patient.patientType;
        const professionalUser = await User.findById(professional.user);
        const professionalName =
            professionalUser.name +
            " " +
            professionalUser.fatherName +
            " " +
            professionalUser.grandfatherName;
        const department = professional.department;

        res.status(200).json({
            appointment,
            patientType,
            patientName,
            professionalName,
            professionalDepartment: department,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching appointment details",
            error: error.message,
        });
    }
};

//* API - cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        // find appointment patient session and professional session and update the status to available
        let professional = await Professional.findById(
            appointment.professionalId
        );
        const patient = await Patient.findById(appointment.patientId);

        const professionalSchedule = await Schedule.findOne({
            userId: professional.user,
        });
        const patientSchedule = await Schedule.findOne({
            userId: patient.user,
        });

        if (!professionalSchedule || !patientSchedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }

        // Find patient session in current week
        let patientSession = patientSchedule.currentWeek.find(
            (session) =>
                session._id.toString() ===
                appointment.patientSession[0].toString()
        );
        if (!patientSession) {
            // Find session in next week
            patientSession = patientSchedule.nextWeek.find(
                (session) =>
                    session._id.toString() ===
                    appointment.patientSession[0].toString()
            );
            if (!patientSession) {
                return res
                    .status(404)
                    .json({ message: "Patient session not found" });
            }
        }

        // Find professional session in current week
        let professionalSession = professionalSchedule.currentWeek.find(
            (session) =>
                session._id.toString() ===
                appointment.professionalSession[0].toString()
        );
        if (!professionalSession) {
            // Find session in next week
            professionalSession = professionalSchedule.nextWeek.find(
                (session) =>
                    session._id.toString() ===
                    appointment.professionalSession[0].toString()
            );
            if (!professionalSession) {
                return res
                    .status(404)
                    .json({ message: "Professional session not found" });
            }
        }

        // update the status of the sessions
        patientSession.status = "available";
        professionalSession.status = "available";

        // Save the parent documents
        await patientSchedule.save();
        await professionalSchedule.save();

        // Decrement the number of appointments for the professional
        professional.numberOfAppointments -= 1;
        await professional.save();

        // remove the appointment from the appointment database
        await Appointment.findByIdAndDelete(appointmentId);
        updateAvailabilityBasedOnTime();

        res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error canceling appointment",
            error: error.message,
        });
    }
};

//* API - edit appointment
const editAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const {
            patientId,
            professionalId,
            patientSessionId,
            professionalSessionId,
        } = req.body;

        const newAppointment = await createIsolatedAppointment(
            patientSessionId,
            professionalSessionId,
            patientId,
            professionalId
        );

        // Find the appointment to edit
        const appointmentToEdit = await Appointment.findById(appointmentId);
        if (!appointmentToEdit) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // get the professional and patient
        const professional = await Professional.findById(
            appointmentToEdit.professionalId
        );
        const patient = await Patient.findById(appointmentToEdit.patientId);

        // Make previous sessions available
        // Find patient session in current week

        const professionalSchedule = await Schedule.findOne({
            userId: professional.user,
        });
        const patientSchedule = await Schedule.findOne({
            userId: patient.user,
        });

        if (!professionalSchedule || !patientSchedule) {
            throw new Error("Schedule not found");
        }

        let patientSession = patientSchedule.currentWeek.find(
            (session) =>
                session._id.toString() ===
                appointmentToEdit.patientSession[0].toString()
        );
        if (!patientSession) {
            // Find session in next week
            patientSession = patientSchedule.nextWeek.find(
                (session) =>
                    session._id.toString() ===
                    appointmentToEdit.patientSession[0].toString()
            );
            if (!patientSession) {
                throw new Error("Patient session not found");
            }
        }

        // Find professional session in current week
        let professionalSession = professionalSchedule.currentWeek.find(
            (session) =>
                session._id.toString() ===
                appointmentToEdit.professionalSession[0].toString()
        );
        if (!professionalSession) {
            // Find session in next week
            professionalSession = professionalSchedule.nextWeek.find(
                (session) =>
                    session._id.toString() ===
                    appointmentToEdit.professionalSession[0].toString()
            );
            if (!professionalSession) {
                throw new Error("Professional session not found");
            }
        }

        patientSession.status = "available";
        professionalSession.status = "available";

        // Save the parent documents
        await patientSchedule.save();
        await professionalSchedule.save();

        // Update the appointment with the new appointment details
        appointmentToEdit.patientSession = [newAppointment.patientSession[0]];
        appointmentToEdit.professionalSession = [
            newAppointment.professionalSession[0],
        ];
        appointmentToEdit.patientId = newAppointment.patientId;
        appointmentToEdit.professionalId = newAppointment.professionalId;
        appointmentToEdit.sessionNumber = newAppointment.sessionNumber;
        appointmentToEdit.startTime = newAppointment.startTime;
        appointmentToEdit.date = newAppointment.date;
        appointmentToEdit.type = newAppointment.type;

        await appointmentToEdit.save();
        updateAvailabilityBasedOnTime();

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment: appointmentToEdit,
        });
    } catch (error) {
        console.error("Error in editAppointment:", error);
        res.status(500).json({
            message: "Error editing appointment",
            error: error.message,
        });
    }
};

//* Local function - update appointment status
const updateAppointmentStatus = async () => {
    try {
        const appointments = await Appointment.find({ status: "active" });

        for (const appointment of appointments) {
            const professional = await Professional.findById(
                appointment.professionalId
            );
            const professionalSchedule = await Schedule.findOne({
                userId: professional.user,
            });

            if (!professionalSchedule) {
                console.error(
                    `Professional schedule not found for appointment ${appointment._id}`
                );
                continue;
            }

            const professionalSession =
                professionalSchedule.currentWeek.find(
                    (session) =>
                        session._id.toString() ===
                        appointment.professionalSession[0].toString()
                ) ||
                professionalSchedule.nextWeek.find(
                    (session) =>
                        session._id.toString() ===
                        appointment.professionalSession[0].toString()
                );

            if (!professionalSession) {
                console.error(
                    `Professional session not found for appointment ${appointment._id}`
                );
                continue;
            }

            if (professionalSession.status === "unavailable") {
                appointment.status = "passed";
                await appointment.save();
                
                professional.numberOfAppointments -= 1;
                await professional.save();
            }
        }

        console.log("Appointment statuses updated successfully");
    } catch (error) {
        console.error("Error in updateAppointmentStatus:", error);
    }
};

//* Local function - create earliest appointment
const createEarliestAppointment = async (professionalId, patientId) => {
    try {
        professionalId = professionalId.toString();
        patientId = patientId.toString();
        const {
            commonAvailableSessionsCurrentWeek,
            commonAvailableSessionsNextWeek,
        } = await commonAvailableSessions(professionalId, patientId);

        // Combine current and next week sessions
        const allSessions = [
            ...commonAvailableSessionsCurrentWeek,
            ...commonAvailableSessionsNextWeek,
        ];

        if (allSessions.length === 0) {
            throw new Error("No common available sessions found");
        }

        // Sort sessions by date and time
        allSessions.sort(
            (a, b) =>
                new Date(a.professional.date) - new Date(b.professional.date)
        );

        // Get the earliest session
        const earliestSession = allSessions[0];

        // Book the appointment using createIsolatedAppointment
        const appointmentData = await createIsolatedAppointment(
            earliestSession.patient._id.toString(),
            earliestSession.professional._id.toString(),
            patientId,
            professionalId
        );

        // Create the appointment using the returned data
        const savedAppointment = await Appointment.create(appointmentData);

        return savedAppointment;
    } catch (error) {
        console.error("Error in createEarliestAppointment:", error);
        throw error;
    }
};

module.exports = {
    getCommonAvailableSessions,
    addIsolatedAppointment,
    getAllAppointmentsForUser,
    getAppointmentDetails,
    cancelAppointment,
    editAppointment,
    updateAppointmentStatus,
    createEarliestAppointment,
};
