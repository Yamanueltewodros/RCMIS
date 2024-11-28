import React, { useState, useEffect } from "react";
import "./PatientPagesStyles/Engage.css";

const Report = () => {
    const [engagements, setEngagements] = useState([]);
    const [filteredEngagements, setFilteredEngagements] = useState([]);
    const [selectedType, setSelectedType] = useState("all");

    useEffect(() => {
        fetch("http://localhost:5000/api/engagement/all")
            .then(response => response.json())
            .then(data => {
                setEngagements(data);
                setFilteredEngagements(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        if (selectedType === "all") {
            setFilteredEngagements(engagements);
        } else {
            setFilteredEngagements(engagements.filter(item => item.mediaType === selectedType));
        }
    }, [selectedType, engagements]);

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const groupByCategory = (engagements) => {
        return engagements.reduce((acc, item) => {
            if (!acc[item.mediaType]) {
                acc[item.mediaType] = [];
            }
            acc[item.mediaType].push(item);
            return acc;
        }, {});
    };

    return (
        <div className="report-container">
            <h1 className="report-title">Report</h1>
            <div className="button-group">
                <button className="filter-button" onClick={() => handleTypeChange("all")}>All</button>
                <button className="filter-button" onClick={() => handleTypeChange("image")}>Image</button>
                <button className="filter-button" onClick={() => handleTypeChange("video")}>Video</button>
                <button className="filter-button" onClick={() => handleTypeChange("pdf")}>PDF</button>
                <button className="filter-button" onClick={() => handleTypeChange("document")}>Document</button>
                <button className="filter-button" onClick={() => handleTypeChange("audio")}>Audio</button>
                <button className="filter-button" onClick={() => handleTypeChange("other")}>Other</button>
            </div>
            {selectedType === "all" ? (
                Object.entries(groupByCategory(filteredEngagements)).map(([type, items]) => (
                    <div key={type} className="category-group">
                        <h2 className="category-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <ul className="engagement-list">
                            {items.map(item => (
                                <li className="engagement-item" key={item._id}>
                                    {item.mediaType === 'image' && (
                                        <img src={item.url} alt={item.description} className="engagement-image" />
                                    )}
                                    <p className="engagement-description">{item.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <ul className="engagement-list">
                    {filteredEngagements.map(item => (
                        <li className="engagement-item" key={item._id}>
                            {item.mediaType === 'image' && (
                                <img src={item.url} alt={item.description} className="engagement-image" />
                            )}
                            <p className="engagement-description">{item.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Report;
