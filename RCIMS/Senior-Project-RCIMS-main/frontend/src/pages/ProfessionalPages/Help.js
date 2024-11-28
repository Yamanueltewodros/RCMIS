// import React, { useState } from "react";
// import helpContent from "./help.json"; 
// //import "./ProfessionalStyles/help.css";
// import "./ProfessionalStyles/help.css";
// const HelpPage = () => {
//   const [searchTerm, setSearchTerm] = useState(""); // State for search term

//   // Filtering the help content based on the search term
//   const filteredContent = helpContent.filter((item) =>
//     item.question.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//       <h1>Help Center</h1>
//       <input
//         type="text"
//         placeholder="Search for help topics..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={{
//           padding: "10px",
//           width: "100%",
//           marginBottom: "20px",
//           borderRadius: "5px",
//           border: "1px solid #ccc",
//         }}
//       />
//       {filteredContent.length > 0 ? (
//         filteredContent.map((item) => (
//           <div
//             key={item.id}
//             style={{
//               borderBottom: "1px solid #eee",
//               padding: "15px 0",
//               marginBottom: "10px",
//             }}
//           >
//             <h3 style={{ margin: "0 0 10px" }}>{item.question}</h3>
//             <p style={{ margin: "0" }}>{item.answer}</p>
//           </div>
//         ))
//       ) : (
//         <p>No help topics found. Please try another search term.</p>
//       )}
//     </div>
//   );
// };

// export default HelpPage;




import React, { useState } from "react";
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  TextField, 
  Snackbar, 
  Container, 
  Paper
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAlert from '@mui/material/Alert';
import helpContent from "./help.json"; // Assuming this contains the questions/answers

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar for popout message
  const [selectedQuestion, setSelectedQuestion] = useState(""); // Track the clicked question

  // Filter help content based on the search term
  const filteredContent = helpContent.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccordionClick = (question) => {
    setSelectedQuestion(question);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
   < Paper  elevation={0} sx={{ p: 2, borderRadius: 4 }}>
    <Container maxWidth="md" sx={{ marginLeft: 10 }} className="mt-10 ml-0" >
      <Typography variant="h4" align="left" sx={{marginLeft: 6, marginBottom: 8}} className="text-gray-800 font-bold ">
        Help Center
      </Typography>

      {/* Search Bar */}
      <TextField sx={{marginBottom: 10}}
        variant="outlined"
        fullWidth
        placeholder="Search for help topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-white shadow-md rounded-md"
      />

      {/* Accordion for Questions */}
      {filteredContent.length > 0 ? (
        filteredContent.map((item) => (
          <Accordion key={item.id} className="mb-4 border border-gray-200 rounded-lg shadow-sm">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => handleAccordionClick(item.question)}
              className="hover:bg-gray-100"
            >
              <Typography className="text-lg font-medium">{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails  className="bg-blue-100" >
              <Typography className="text-gray-700">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography className="text-red-600">
          No help topics found. Please try another search term.
        </Typography>
      )}

    </Container>
    </Paper>
  );
};

export default HelpPage;

