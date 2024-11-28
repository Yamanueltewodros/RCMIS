import React, { useState, useEffect } from "react";
import "../Styling/AdminPageStyles/AdminEngage.css";

const AdminEngagementForm = () => {
  const [mediaType, setMediaType] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [engagements, setEngagements] = useState([]);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [message, setMessage] = useState("");
  const [view, setView] = useState("add");

  // Function to add engagement
  const handleAddEngagement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/engagement/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaType, url, description }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Engagement added successfully!");
        setMediaType("");
        setUrl("");
        setDescription("");
        fetchEngagements(); // Refresh the engagement list
      } else {
        setMessage(data.message || "Error adding engagement");
      }
    } catch (error) {
      setMessage("Error adding engagement: " + error.message);
    }
  };

  // Function to get all engagements
  const fetchEngagements = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/engagement/all");
      const data = await response.json();

      if (response.ok) {
        setEngagements(data);
      } else {
        setMessage("Error fetching engagements");
      }
    } catch (error) {
      setMessage("Error fetching engagements: " + error.message);
    }
  };

  // Function to delete engagement
  const handleDeleteEngagement = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/engagement/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Engagement deleted successfully!");
        setSelectedEngagement(null); // Close the details view
        fetchEngagements(); // Refresh the list
      } else {
        setMessage(data.message || "Error deleting engagement");
      }
    } catch (error) {
      setMessage("Error deleting engagement: " + error.message);
    }
  };

  // Function to toggle view details and hide
  const handleViewDetails = (engagement) => {
    setSelectedEngagement(selectedEngagement && selectedEngagement._id === engagement._id ? null : engagement);
  };

  // Fetch engagements when switching to view mode
  useEffect(() => {
    if (view === "view") {
      fetchEngagements();
    }
  }, [view]);

  return (
    <div className="admin-engagement-container">
      <h1 className="admin-engagement-title">Admin - Engagement Management</h1>

      {/* Toggle buttons between "View Engagements" and "Add Engagement" */}
      <div className="admin-engagement-button-group">
        <button onClick={() => setView("add")} className="admin-engagement-button">Add Engagement</button>
        <button onClick={() => setView("view")} className="admin-engagement-button">View Engagements</button>
      </div>

      {/* Show "Add Engagement" form when view is set to "add" */}
      {view === "add" && (
        <form onSubmit={handleAddEngagement} className="admin-engagement-form">
          <h2 className="form-title">Add Engagement</h2>
          <div className="form-group">
            <label htmlFor="mediaType">Media Type:</label>
            <input
              type="text"
              id="mediaType"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">URL:</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-textarea"
            />
          </div>

          <button type="submit" className="form-submit-button">Add Engagement</button>
        </form>
      )}

      {/* Show "View Engagements" when view is set to "view" */}
      {view === "view" && (
        <div className="engagement-list-container">
          <h2 className="engagement-list-title">Engagement List</h2>
          <ul className="engagement-list">
            {engagements.map((engagement) => (
              <li key={engagement._id} className="engagement-item">
                {engagement.mediaType} - {engagement.url}
                <button onClick={() => handleViewDetails(engagement)} className="engagement-details-button">
                  {selectedEngagement && selectedEngagement._id === engagement._id ? "Hide Details" : "View Details"}
                </button>

                {/* Engagement details below each engagement */}
                {selectedEngagement && selectedEngagement._id === engagement._id && (
                  <div className="engagement-details">
                    <h3>Engagement Details</h3>
                    <p><strong>Media Type:</strong> {selectedEngagement.mediaType}</p>
                    <p><strong>URL:</strong> {selectedEngagement.url}</p>
                    <p><strong>Description:</strong> {selectedEngagement.description}</p>
                    <button
                      onClick={() => handleDeleteEngagement(selectedEngagement._id)}
                      className="delete-btn"
                    >
                      Delete Engagement
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message display */}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminEngagementForm;
