import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styling/AdminPageStyles/FeedbacksStyles.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from "@mui/material";

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [viewMode, setViewMode] = useState("list");

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/feedback/get-all-feedbacks"
            );
            setFeedbacks(response.data);
            setLoading(false);
        } catch (err) {
            setError("Error fetching feedbacks. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const getTypeColor = (type, status) => {
        if (status === "read") return "var(--color-read)";
        switch (type.toLowerCase()) {
            case "complaint":
                return "var(--color-complaint)";
            case "gratitude":
                return "var(--color-gratitude)";
            case "suggestion":
                return "var(--color-suggestion)";
            default:
                return "var(--color-other)";
        }
    };

    const getStatusColor = (status, type) => {
        if (status === "read") return "var(--color-text-read)";
        switch (type.toLowerCase()) {
            case "complaint":
                return "var(--color-text-complaint)";
            default:
                return "var(--color-text-other)";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Africa/Nairobi",
        });
    };

    // Add a new function to handle filtering
    const getFilteredFeedbacks = () => {
        return feedbacks.filter((feedback) => {
            const statusMatch =
                statusFilter === "all" || feedback.status === statusFilter;
            const typeMatch =
                typeFilter === "all" || feedback.type === typeFilter;
            return statusMatch && typeMatch;
        });
    };

    const handleFeedbackClick = async (feedbackId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/feedback/get-feedback/${feedbackId}`
            );
            setSelectedFeedback(response.data);
            setViewMode("details");
        } catch (err) {
            console.error("Error fetching feedback details:", err);
        }
    };

    const handleBackToList = () => {
        setViewMode("list");
        setSelectedFeedback(null);
        fetchFeedbacks(); // Reload the list when going back
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="feedbacks-container">
            {viewMode === "list" ? (
                <>
                    <h2>User Feedbacks</h2>
                    <form className="feedback-filters">
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="read">Read</option>
                            </select>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="complaint">Complaint</option>
                                <option value="gratitude">Gratitude</option>
                                <option value="suggestion">Suggestion</option>
                            </select>
                        </div>
                    </form>

                    <div className="feedbacks-content">
                        <div className="feedbacks-list-container">
                            {getFilteredFeedbacks().length === 0 ? (
                                <p>No feedbacks found.</p>
                            ) : (
                                <ul className="feedbacks-list">
                                    {getFilteredFeedbacks().map((feedback) => (
                                        <li
                                            key={feedback._id}
                                            className={`feedback-item ${
                                                selectedFeedback &&
                                                selectedFeedback._id ===
                                                    feedback._id
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            style={{
                                                border: `1px solid ${getTypeColor(
                                                    feedback.type,
                                                    feedback.status
                                                )}`,
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                handleFeedbackClick(
                                                    feedback._id
                                                )
                                            }
                                        >
                                            <div className="feedback-info">
                                                <div className="feedback-type">
                                                    <p
                                                        style={{
                                                            color: getStatusColor(
                                                                feedback.status,
                                                                feedback.type
                                                            ),
                                                        }}
                                                    >
                                                        <strong>
                                                            {feedback.type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                feedback.type.slice(
                                                                    1
                                                                )}
                                                        </strong>
                                                    </p>
                                                    <span
                                                        style={{
                                                            marginRight: "10px",
                                                            width: "5px",
                                                            height: "5px",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                feedback.status ===
                                                                "active"
                                                                    ? "darkblue"
                                                                    : "transparent",
                                                        }}
                                                    />
                                                </div>
                                                <hr />
                                                <p
                                                    style={{
                                                        color: getStatusColor(
                                                            feedback.status,
                                                            feedback.type
                                                        ),
                                                    }}
                                                >
                                                    {feedback.message
                                                        .split(" ")
                                                        .slice(0, 2)
                                                        .join(" ")}
                                                    ...
                                                </p>
                                                <p>
                                                    {formatDate(feedback.date)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="feedback-details-view">
                    <div className="feedback-details-header">
                        <IconButton onClick={handleBackToList} className="back-button">
                            <ArrowBackIcon />
                        </IconButton>
                        <h3>Feedback Details</h3>
                    </div>
                    <div className="feedback-type-badge">
                        {selectedFeedback.type}
                    </div>
                    <div className="feedback-date">
                        {formatDate(selectedFeedback.date)}
                    </div>
                    <div className="feedback-section">
                        <div className="feedback-section-title">
                            Sender Information
                        </div>
                        <p>
                            <strong>Full Name:</strong>{" "}
                            {`${selectedFeedback.sender.name} ${selectedFeedback.sender.fatherName} ${selectedFeedback.sender.grandfatherName}`}
                        </p>
                        <p>
                            <strong>Phone Number:</strong>{" "}
                            {selectedFeedback.sender.phoneNumber}
                        </p>
                    </div>
                    <div className="feedback-section">
                        <div className="feedback-section-title">Message</div>
                        <div className="feedback-message">
                            {selectedFeedback.message}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedbacks;
