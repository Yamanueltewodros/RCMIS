import React, { useState } from "react";
import helpContent from "./help.json"; 
import "./ProfessionalStyles/help.css";
const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Filtering the help content based on the search term
  const filteredContent = helpContent.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Help Center</h1>
      <input
        type="text"
        placeholder="Search for help topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      {filteredContent.length > 0 ? (
        filteredContent.map((item) => (
          <div
            key={item.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: "15px 0",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: "0 0 10px" }}>{item.question}</h3>
            <p style={{ margin: "0" }}>{item.answer}</p>
          </div>
        ))
      ) : (
        <p>No help topics found. Please try another search term.</p>
      )}
    </div>
  );
};

export default HelpPage;
