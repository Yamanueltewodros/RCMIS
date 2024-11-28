const Schedule = require("../models/Schedule");
const Professional = require("../models/Professional");
const Patient = require("../models/Patient");

const sessionStartTime = {
    1: "04:00:00Z",
    2: "05:00:00Z",
    3: "06:00:00Z",
    4: "07:00:00Z",
    5: "08:00:00Z",
    6: "11:00:00Z",
    7: "12:00:00Z",
    8: "13:00:00Z",
};

// Local function - add a new schedule for a newly created professional
const addProfessionalSchedule = async (userId) => {
    try {
        const professional = await Professional.findOne({ user: userId });

        if (!professional) {
            throw new Error("Professional not found");
        }

        const professionalType = professional.type;

        let newSchedule;

        const currentWeek = [];
        const nextWeek = [];

        // get the current date by name of the day
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay();

        switch (professionalType) {
            case "isolated":
                //create unavailable days for the past days of the week
                for (let i = 0; i < currentDayOfWeek; i++) {
                    const pastDay = new Date();
                    pastDay.setDate(pastDay.getDate() - pastDay.getDay() + i);
                    for (let j = 4; j <= 8; j++) {
                        currentWeek.push({
                            date: pastDay.toISOString().split("T")[0],
                            sessionNumber: j,
                            type: "isolated",
                            status: "unavailable",
                        });
                    }
                }

                // create available days for the remaining days of the current week
                for (let i = currentDayOfWeek; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i
                    );
                    for (let j = 4; j <= 8; j++) {
                        const currentTime = new Date();
                        const sessionTime = new Date(nextDay);
                        const [hours, minutes, seconds] =
                            sessionStartTime[j].split(":");
                        sessionTime.setUTCHours(
                            parseInt(hours),
                            parseInt(minutes),
                            parseInt(seconds),
                            0
                        );

                        const status =
                            currentTime < sessionTime
                                ? "available"
                                : "unavailable";

                        currentWeek.push({
                            date: new Date(nextDay).toISOString().split("T")[0],
                            sessionNumber: j,
                            type: "isolated",
                            status: status,
                        });
                    }
                }

                // create available days for the next week
                for (let i = 0; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i + 7
                    );
                    for (let j = 4; j <= 8; j++) {
                        nextWeek.push({
                            date: new Date(nextDay).toISOString().split("T")[0],
                            sessionNumber: j,
                            type: "isolated",
                            status: "available",
                        });
                    }
                }

                newSchedule = await Schedule.create({
                    userId: userId,
                    currentWeek: currentWeek,
                    nextWeek: nextWeek,
                });
                break;
            case "group":
                // create unavailable days for the past days of the week
                for (let i = 0; i <= currentDayOfWeek; i++) {
                    const pastDay = new Date();
                    pastDay.setDate(pastDay.getDate() - pastDay.getDay() + i);
                    for (let j = 2; j <= 8; j++) {
                        if (j === 2 || j === 3 || j === 7 || j === 8) {
                            currentWeek.push({
                                date: pastDay.toISOString().split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "unavailable",
                            });
                        }
                    }
                }

                // create available days for the remaining days of the current week
                for (let i = currentDayOfWeek + 1; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i + 1
                    );
                    for (let j = 2; j <= 8; j++) {
                        if (j === 2 || j === 3 || j === 7 || j === 8) {
                            currentWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "available",
                            });
                        }
                    }
                }

                // create available days for the next week
                for (let i = 0; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i + 7
                    );
                    for (let j = 2; j <= 8; j++) {
                        if (j === 2 || j === 3 || j === 7 || j === 8) {
                            nextWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "available",
                            });
                        }
                    }
                }

                newSchedule = await Schedule.create({
                    userId: userId,
                    currentWeek: currentWeek,
                    nextWeek: nextWeek,
                });

                break;
            case "physical":
                // create unavailable days for the past days of the week
                for (let i = 0; i <= currentDayOfWeek; i++) {
                    const pastDay = new Date();
                    pastDay.setDate(pastDay.getDate() - pastDay.getDay() + i);
                    for (let j = 1; j <= 3; j++) {
                        currentWeek.push({
                            date: pastDay.toISOString().split("T")[0],
                            sessionNumber: j,
                            type: "physical",
                            status: "unavailable",
                        });
                    }
                }

                // create available days for the remaining days of the current week
                for (let i = currentDayOfWeek + 1; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i + 1
                    );
                    for (let j = 1; j <= 3; j++) {
                        currentWeek.push({
                            date: new Date(nextDay).toISOString().split("T")[0],
                            sessionNumber: j,
                            type: "physical",
                            status: "available",
                        });
                    }
                }

                // create available days for the next week
                for (let i = 0; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i + 7
                    );
                    for (let j = 1; j <= 3; j++) {
                        nextWeek.push({
                            date: new Date(nextDay).toISOString().split("T")[0],
                            sessionNumber: j,
                            type: "physical",
                            status: "available",
                        });
                    }
                }

                newSchedule = await Schedule.create({
                    userId: userId,
                    currentWeek: currentWeek,
                    nextWeek: nextWeek,
                });
                break;
            default:
                throw new Error("Invalid professional type");
        }

        const savedSchedule = await newSchedule.save();
        return savedSchedule;
    } catch (error) {
        throw new Error(`Error adding professional schedule: ${error.message}`);
    }
};

// API - get the earliest available date for a professional
const getEarliestAvailableDateProfessional = async (req, res) => {
    try {
        const { professionalID } = req.params;
        const professional = await Professional.findById(professionalID);

        if (!professional) {
            return res.status(404).json({
                message: "Professional not found",
                earliestAvailableDate: null,
            });
        }

        const schedule = await Schedule.findOne({
            professionalId: professional._id,
            $or: [
                { "currentWeek.status": "available" },
                { "nextWeek.status": "available" },
            ],
        });

        if (!schedule) {
            return res.status(404).json({
                message: "No available sessions found",
                earliestAvailableDate: null,
            });
        }

        const availableSession =
            schedule.currentWeek.find(
                (session) => session.status === "available"
            ) ||
            schedule.nextWeek.find((session) => session.status === "available");

        res.status(200).json({
            message: "Earliest available date retrieved successfully",
            earliestAvailableDate: {
                date: availableSession.date,
                sessionNumber: availableSession.sessionNumber,
                startTime: sessionStartTime[availableSession.sessionNumber],
            },
        });
    } catch (error) {
        console.error("Error in getEarliestAvailableDate:", error);
        res.status(500).json({
            message: "Error getting earliest available date",
            error: error.message,
        });
    }
};

// Local function - add a new schedule for a patient
const addPatientSchedule = async (userId) => {
    try {
        const patient = await Patient.findOne({ user: userId });

        if (!patient) {
            throw new Error("Patient not found");
        }

        const patientType = patient.patientType;

        let newSchedule;

        const currentWeek = [];
        const nextWeek = [];

        // get the current date by name of the day
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay();

        switch (patientType) {
            case "In-patient":
                // create unavailable days for the past days of the week
                for (let i = 0; i <= currentDayOfWeek; i++) {
                    const pastDay = new Date();
                    pastDay.setDate(pastDay.getDate() - pastDay.getDay() + i);
                    for (let j = 1; j <= 8; j++) {
                        if (j === 1 || j === 2 || j === 3) {
                            currentWeek.push({
                                date: pastDay.toISOString().split("T")[0],
                                sessionNumber: j,
                                type: "physical",
                                status: "unavailable",
                            });
                        }
                        if (j === 4) continue;
                        if (j === 5 || j === 6) {
                            currentWeek.push({
                                date: pastDay.toISOString().split("T")[0],
                                sessionNumber: j,
                                type: "isolated",
                                status: "unavailable",
                            });
                        }
                        if (j === 7 || j === 8) {
                            currentWeek.push({
                                date: pastDay.toISOString().split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "unavailable",
                            });
                        }
                    }
                }

                // create available days for the remaining days of the current week
                for (let i = currentDayOfWeek + 1; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i
                    );
                    for (let j = 1; j <= 8; j++) {
                        if (j === 1 || j === 2 || j === 3) {
                            currentWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "physical",
                                status: "available",
                            });
                        }
                        if (j === 4) continue;
                        if (j === 5 || j === 6) {
                            currentWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "isolated",
                                status: "available",
                            });
                        }
                        if (j === 7 || j === 8) {
                            currentWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "available",
                            });
                        }
                    }
                }

                // create available days for the next week
                for (let i = 0; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i + 7
                    );
                    for (let j = 1; j <= 8; j++) {
                        if (j === 1 || j === 2 || j === 3) {
                            nextWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "physical",
                                status: "available",
                            });
                        } else if (j === 5 || j === 6) {
                            nextWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "isolated",
                                status: "available",
                            });
                        } else if (j === 7 || j === 8) {
                            nextWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "available",
                            });
                        }
                    }
                }

                newSchedule = await Schedule.create({
                    userId: userId,
                    currentWeek: currentWeek,
                    nextWeek: nextWeek,
                });
                break;

            case "Out-patient":
                // create unavailable days for the past days of the week
                for (let i = 0; i <= currentDayOfWeek; i++) {
                    const pastDay = new Date();
                    pastDay.setDate(pastDay.getDate() - pastDay.getDay() + i);
                    for (let j = 1; j <= 8; j++) {
                        if (j === 1 || j === 5 || j === 6) continue;
                        if (j === 2 || j === 3) {
                            currentWeek.push({
                                date: pastDay.toISOString().split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "unavailable",
                            });
                        }
                        if (j === 4 || j === 7 || j === 8) {
                            currentWeek.push({
                                date: pastDay.toISOString().split("T")[0],
                                sessionNumber: j,
                                type: "isolated",
                                status: "unavailable",
                            });
                        }
                    }
                }

                // create available days for the remaining days of the current week
                for (let i = currentDayOfWeek + 1; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i
                    );
                    for (let j = 1; j <= 8; j++) {
                        if (j === 2 || j === 3) {
                            currentWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "available",
                            });
                        } else if (j === 4 || j === 7 || j === 8) {
                            currentWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "isolated",
                                status: "available",
                            });
                        }
                    }
                }

                // create available days for the next week
                for (let i = 0; i < 7; i++) {
                    const nextDay = new Date();
                    nextDay.setDate(
                        currentDate.getDate() - currentDate.getDay() + i + 7
                    );
                    for (let j = 1; j <= 8; j++) {
                        if (j === 2 || j === 3) {
                            nextWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "group",
                                status: "available",
                            });
                        } else if (j === 4 || j === 7 || j === 8) {
                            nextWeek.push({
                                date: new Date(nextDay)
                                    .toISOString()
                                    .split("T")[0],
                                sessionNumber: j,
                                type: "isolated",
                                status: "available",
                            });
                        }
                    }
                }

                newSchedule = await Schedule.create({
                    userId: userId,
                    currentWeek: currentWeek,
                    nextWeek: nextWeek,
                });
                break;
            default:
                throw new Error("Invalid patient type");
        }

        return await newSchedule.save();
    } catch (error) {
        throw new Error(`Error adding patient schedule: ${error.message}`);
    }
};

// Local Function - update schedule every sunday
const updateSchedule = async () => {
    try {
        // get the current date
        const date = new Date();
        let currentDate = `${date.getFullYear()}-${padZero(
            date.getMonth() + 1
        )}-${padZero(date.getDate())}`;

        // get the first enty of schedule from the schedule collection
        const schedule = await Schedule.findOne();
        // Check if a schedule exists
        if (!schedule) {
            return;
        }
        // find the first saved date in the schedule for the next week
        let firstDayOfNextWeek = new Date(schedule.nextWeek[0].date);

        // check if the current date is the same as the first date of the next week or greater
        if (currentDate < firstDayOfNextWeek.toISOString().split("T")[0]) {
            return;
        }

        // copy all of the items in the nextweek to the currentweek
        const schedules = await Schedule.find();
        for (const schedule of schedules) {
            let updatedCurrentWeek = [];
            // schedule.currentWeek = schedule.nextWeek;
            updatedCurrentWeek = schedule.nextWeek;
            schedule.currentWeek = updatedCurrentWeek;
            // get the user of the schedule
            const professional = await Professional.findOne({
                user: schedule.userId,
            });
            const patient = await Patient.findOne({
                user: schedule.userId,
            });
            let newNextWeek = [];
            if (professional) {
                // get the professional type
                const professionalType = professional.type;

                switch (professionalType) {
                    case "isolated":
                        for (let i = 0; i < 7; i++) {
                            const nextDay = new Date(firstDayOfNextWeek);
                            nextDay.setDate(nextDay.getDate() + i + 7);
                            for (let j = 4; j <= 8; j++) {
                                newNextWeek.push({
                                    date: nextDay.toISOString().split("T")[0],
                                    sessionNumber: j,
                                    status: "available",
                                    type: "isolated",
                                });
                            }
                        }
                        // add the new next week to the schedule
                        schedule.nextWeek = newNextWeek;
                        break;
                    case "group":
                        for (let i = 0; i < 7; i++) {
                            const nextDay = new Date(firstDayOfNextWeek);
                            nextDay.setDate(nextDay.getDate() + i + 7);
                            for (let j = 2; j <= 8; j++) {
                                if (j === 2 || j === 3 || j === 7 || j === 8) {
                                    newNextWeek.push({
                                        date: nextDay
                                            .toISOString()
                                            .split("T")[0],
                                        sessionNumber: j,
                                        status: "available",
                                        type: "group",
                                    });
                                }
                            }
                        }
                        // add the new next week to the schedule
                        schedule.nextWeek = newNextWeek;
                        break;
                    case "physical":
                        for (let i = 0; i < 7; i++) {
                            const nextDay = new Date(firstDayOfNextWeek);
                            nextDay.setDate(nextDay.getDate() + i + 7);
                            for (let j = 1; j <= 3; j++) {
                                newNextWeek.push({
                                    date: nextDay.toISOString().split("T")[0],
                                    sessionNumber: j,
                                    status: "available",
                                    type: "physical",
                                });
                            }
                        }
                        // add the new next week to the schedule
                        schedule.nextWeek = newNextWeek;
                        break;
                }
            } else if (patient) {
                const patientType = patient.patientType;
                switch (patientType) {
                    case "In-patient":
                        // create available days for the next week
                        for (let i = 0; i < 7; i++) {
                            const nextDay = new Date(firstDayOfNextWeek);
                            nextDay.setDate(nextDay.getDate() + i + 7);
                            for (let j = 1; j <= 8; j++) {
                                if (j === 1 || j === 2 || j === 3) {
                                    newNextWeek.push({
                                        date: nextDay
                                            .toISOString()
                                            .split("T")[0],
                                        sessionNumber: j,
                                        type: "physical",
                                        status: "available",
                                    });
                                }
                                if (j === 4) continue;
                                if (j === 5 || j === 6) {
                                    newNextWeek.push({
                                        date: nextDay
                                            .toISOString()
                                            .split("T")[0],
                                        sessionNumber: j,
                                        type: "isolated",
                                        status: "available",
                                    });
                                }
                                if (j === 7 || j === 8) {
                                    newNextWeek.push({
                                        date: nextDay
                                            .toISOString()
                                            .split("T")[0],
                                        sessionNumber: j,
                                        type: "group",
                                        status: "available",
                                    });
                                }
                            }
                        }
                        // add the new next week to the schedule
                        schedule.nextWeek = newNextWeek;
                        break;
                    case "Out-patient":
                        // create available days for the next week
                        for (let i = 0; i < 7; i++) {
                            const nextDay = new Date(firstDayOfNextWeek);
                            nextDay.setDate(nextDay.getDate() + i + 7);
                            for (let j = 1; j <= 8; j++) {
                                if (j === 1 || j === 5 || j === 6) continue;
                                if (j === 2 || j === 3) {
                                    newNextWeek.push({
                                        date: nextDay
                                            .toISOString()
                                            .split("T")[0],
                                        sessionNumber: j,
                                        type: "group",
                                        status: "available",
                                    });
                                }
                                if (j === 4 || j === 7 || j === 8) {
                                    newNextWeek.push({
                                        date: nextDay
                                            .toISOString()
                                            .split("T")[0],
                                        sessionNumber: j,
                                        type: "isolated",
                                        status: "available",
                                    });
                                }
                            }
                        }
                        // add the new next week to the schedule
                        schedule.nextWeek = newNextWeek;
                        break;
                }
            } else {
                console.log("User not found");
                continue;
            }
            // save the schedule
            await schedule.save();
        }
    } catch (error) {
        console.error("Error in updateSchedule:", error);
    }
};
// Helper function for date processing
function padZero(num) {
    return (num < 10 ? "0" : "") + num;
}

// update availability based on current time
const updateAvailabilityBasedOnTime = async () => {
    try {
        const currentTime = new Date();

        const schedules = await Schedule.find();
        for (const schedule of schedules) {
            const currentWeek = schedule.currentWeek;
            for (const session of currentWeek) {
                const sessionNumber = session.sessionNumber;
                const sessionStartTimeStr = sessionStartTime[sessionNumber];

                // Create a Date object for the session start time
                const [hours, minutes, seconds] =
                    sessionStartTimeStr.split(":");
                const sessionTime = new Date(session.date);
                sessionTime.setUTCHours(
                    parseInt(hours),
                    parseInt(minutes),
                    parseInt(seconds),
                    0
                );

                //! Test mod
                // if (session.status === "booked") {
                //     continue;
                // }

                if (currentTime < sessionTime) {
                    if (session.status === "booked") {
                        continue;
                    }
                    session.status = "available";
                } else {
                    session.status = "unavailable";
                }
            }
            await schedule.save();
        }
    } catch (error) {
        console.error("Error in updateAvailabilityBasedOnTime:", error);
    }
};

// API - get the schedule for a given user
const getScheduleForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const schedule = await Schedule.findOne({ userId });
        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }

        res.status(200).json({
            message: "Schedule retrieved successfully",
            schedule,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving schedule",
            error: error.message,
        });
    }
};

module.exports = {
    addProfessionalSchedule,
    getEarliestAvailableDateProfessional,
    addPatientSchedule,
    updateSchedule,
    updateAvailabilityBasedOnTime,
    getScheduleForUser,
};
