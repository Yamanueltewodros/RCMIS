import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/Schedule.css"; // Custom CSS for the grid

const Schedule = () => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const timeSlots = [
        "01:00 AM - 02:00 AM",
        "02:00 AM - 03:00 AM",
        "03:00 AM - 04:00 AM",
        "04:00 AM - 05:00 AM",
        "08:00 AM - 09:00 AM",
        "09:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM"
    ];

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const fetchSchedule = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user._id) {
                throw new Error("No user found in local storage.");
            }

            const response = await axios.get(`http://localhost:5000/api/schedule/schedule/${user._id}`);
            if (!response.data.schedule) {
                throw new Error("No schedule found for this user.");
            }

            setSchedule(response.data.schedule);
        } catch (err) {
            setError(
                "Error fetching schedule: " +
                (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule(); 
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const getSessionForTimeSlot = (time, dayIndex, weekType) => {
        const sessionsForDay = schedule[weekType].filter((session) => {
            const sessionDay = new Date(session.date).getDay();
            return sessionDay === dayIndex;
        });

        return sessionsForDay.find((session) => {
            const sessionStartTime = sessionStartTimeMap[session.sessionNumber];
            return sessionStartTime === time;
        });
    };

    const sessionStartTimeMap = {
        1: "01:00 AM - 02:00 AM",
        2: "02:00 AM - 03:00 AM",
        3: "03:00 AM - 04:00 AM",
        4: "04:00 AM - 05:00 AM",
        5: "08:00 AM - 09:00 AM",
        6: "09:00 AM - 10:00 AM",
        7: "10:00 AM - 11:00 AM",
        8: "11:00 AM - 12:00 PM"
    };

    const getSessionClass = (sessionType, status) => {
        if (status === "unavailable") {
            return "session-unavailable"; // Grey for unavailable sessions
        } else if (status === "booked") {
            return "session-booked"; // Light red for booked sessions
        }
        return "session-available"; // White for available sessions
    };

    const hasSessionsForWeek = (weekType) => {
        return schedule[weekType].length > 0;
    };

    const getSessionsForTimeSlot = (time, weekType) => {
        const sessionsForTimeSlot = [];

        daysOfWeek.forEach((_, dayIndex) => {
            const session = getSessionForTimeSlot(time, dayIndex, weekType);
            if (session) {
                sessionsForTimeSlot.push({ dayIndex, session });
            }
        });

        return sessionsForTimeSlot;
    };

    return (
        <div className="schedule-container">
            {hasSessionsForWeek("currentWeek") && (
                <>
                    <h2>Current Week's Schedule</h2>
                    <div className="schedule-grid">
                        {timeSlots.map((time) => {
                            const sessionsForTimeSlot = getSessionsForTimeSlot(time, "currentWeek");

                            if (sessionsForTimeSlot.length === 0) return null;

                            return (
                                <React.Fragment key={time}>
                                    <div key={time} className="time-slot">
                                        {time}
                                    </div>

                                    {sessionsForTimeSlot.map(({ dayIndex, session }) => (
                                        <div key={`${time}-${dayIndex}`} className="session-cell">
                                            <div className={getSessionClass(session.type, session.status)}>
                                                <p>{session.type}</p>
                                                <p>{session.status === "unavailable" ? "Unavailable" : session.status === "booked" ? "Booked" : "Available"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </>
            )}

            {hasSessionsForWeek("nextWeek") && (
                <>
                    <h2>Next Week's Schedule</h2>
                    <div className="schedule-grid">
                        {timeSlots.map((time) => {
                            const sessionsForTimeSlot = getSessionsForTimeSlot(time, "nextWeek");

                            if (sessionsForTimeSlot.length === 0) return null;

                            return (
                                <React.Fragment key={time}>
                                    <div key={time} className="time-slot">
                                        {time}
                                    </div>

                                    {sessionsForTimeSlot.map(({ dayIndex, session }) => (
                                        <div key={`${time}-${dayIndex}`} className="session-cell">
                                            <div className={getSessionClass(session.type, session.status)}>
                                                <p>{session.type}</p>
                                                <p>{session.status === "unavailable" ? "Unavailable" : session.status === "booked" ? "Booked" : "Available"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </>
            )}

            {!hasSessionsForWeek("currentWeek") && !hasSessionsForWeek("nextWeek") && (
                <div>No schedule available for this week or next week.</div>
            )}
        </div>
    );
};

export default Schedule;
