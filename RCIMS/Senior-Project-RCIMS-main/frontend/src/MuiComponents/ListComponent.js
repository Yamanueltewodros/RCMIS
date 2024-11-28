import React, { useState , useEffect} from "react";
import axios from "axios";
//import EditPatient from "../pages/AdminPages/PatientManagement/EditPatient";
//import EditPatient from "../pages/AdminPages/PatientManagement/CaregiverDetail"; 
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import MoreVertIcon from "@mui/icons-material/MoreVert";





// Sample Data for the Table
const patientsData = [
  {
    id: "#809776",
    name: "Wade Warren",
    age: 21,
    gender: "Female",
    ageGroup: "Adult",
    lastVisit: "Jul 12, 2024",
    nextAppointment: "Aug 22, 2024",
    condition: "Acne",
    status: "Improving",
    statusColor: "orange",
  },
  {
    id: "#540775",
    name: "Darlene Robertson",
    age: 27,
    gender: "Male",
    ageGroup: "Adult",
    lastVisit: "Jun 12, 2024",
    nextAppointment: "Aug 8, 2024",
    condition: "Hypertension",
    status: "Scheduled",
    statusColor: "blue",
  },
  // Add more rows as needed...
];


const ListOfPatientsMUI = () => {
  const [filter, setFilter] = useState({ patientType: "", gender: "" });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

 // Fetch patients on component mount and when filters change
 useEffect(() => {
  fetchPatients();
}, [searchTerm, filter]);

const fetchPatients = async () => {
  try {
      console.log("Fetching patients with parameters:", { searchTerm, ...filter });
      
      const response = await axios.get("http://localhost:5000/api/patients/get-patients", {
          params: {
              search: searchTerm,
              patientType: filter.patientType,
              gender: filter.gender,
          },
      });

      console.log("Response received:", response.data);

      setPatients(response.data.patients || response.data);

  } catch (error) {
      console.error("Error fetching patients:", error);
      setError(`Failed to fetch patients. ${error.message}`);
  }
};

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDetails = async (patientId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/patients/get-patient-information/${patientId}`);
        console.log("Patient details received:", response.data);
        setSelectedPatient(response.data.patient);
        setIsEditing(false);
    } catch (error) {
        console.error("Error fetching patient details:", error);
        setError(`Failed to fetch patient details. ${error.message}`);
    }
};

const handleBackToList = () => {
    setSelectedPatient(null);
    setIsEditing(false);
};

const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
        _id: patient._id,
        name: patient.user?.name || "",
        fatherName: patient.user?.fatherName || "",
        grandfatherName: patient.user?.grandfatherName || "",
        phoneNumber: patient.user?.phoneNumber || "",
        address: patient.user?.address || "",
        dateOfBirth: patient.user?.dateOfBirth
            ? new Date(patient.user.dateOfBirth).toISOString().split("T")[0]
            : "",
        gender: patient.user?.gender || "",
        patientType: patient.patientType || "",
        allergies: patient.allergies || "",
        status: patient.status || "",
    });
    setIsEditing(true);
};

const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.put(
            `http://localhost:5000/api/patients/update-patient/${editFormData._id}`,
            editFormData
        );
        if (response.status === 200) {
            alert("Patient updated successfully");
            fetchPatients();
            setIsEditing(false);
            handleDetails(response.data.patient._id);
        }
    } catch (error) {
        console.error("Error updating patient:", error);
        setError(`Failed to update patient. ${error.message}`);
    }
};

const handleRemove = async (patientId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this patient?");
    if (isConfirmed) {
        try {
            await axios.delete(`http://localhost:5000/api/patients/delete-patient/${patientId}`);
            alert("Patient removed successfully");
            setSelectedPatient(null);
            fetchPatients();
        } catch (error) {
            console.error("Error removing patient:", error);
            setError(`Failed to remove patient. ${error.message}`);
        }
    }
};

if (error) {
    return <div>Error: {error}</div>;
}

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
                  {selectedPatient ? (
                isEditing ? (
                    <EditPatient
                        patient={editFormData}
                        handleEditFormChange={handleEditFormChange}
                        handleEditSubmit={handleEditSubmit}
                        setIsEditing={setIsEditing}
                    />
                ) : (
                    <div className="patient-details">
                        <h2>Patient Details</h2>
                        <button className="back-button" onClick={handleBackToList}>Back to List</button>
                        <h3>{`${selectedPatient.user?.name} ${selectedPatient.user?.fatherName} ${selectedPatient.user?.grandfatherName}`}</h3>
                        <p><strong>Phone:</strong> {selectedPatient.user?.phoneNumber}</p>
                        <p><strong>Address:</strong> {selectedPatient.user?.address}</p>
                        <p><strong>Patient Type:</strong> {selectedPatient.patientType}</p>
                        <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
                        <button className="btn btn-edit" onClick={() => handleEdit(selectedPatient)}>Edit</button>
                        <button className="btn btn-remove" onClick={() => handleRemove(selectedPatient._id)}>Remove</button>
                    </div>
                )
            ) : (
     <div>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Patient List</h3>
        <div style={styles.actions}>
          {/* <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          /> */}
                         <input
                            prefix={<SearchIcon />}

                            type="text"
                            className="search-input"
                            placeholder="Search patient"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                         <select
                            className="filter-select"
                            value={filter.gender}
                            onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
                          >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                         <select
                            className="filter-select"
                            value={filter.patientType}
                            onChange={(e) => setFilter({ ...filter, patientType: e.target.value })}
                        >
                            <option value="">All Patient Types</option>
                            <option value="In-patient">In-patient</option>
                            <option value="Out-patient">Out-patient</option>
                        </select>

        </div>
      </div>
      
      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="patient table">
          <TableHead>
            <TableRow>

              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Fathers Name</TableCell>
              <TableCell>GrandFather Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Patient Type</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Address</TableCell>
              {/* <TableCell>Condition</TableCell> */}
             
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>

                <TableCell>{patient._id}</TableCell>
                <TableCell>{patient.user?.name}</TableCell>
                <TableCell>{patient.user?.fatherName}</TableCell>
                <TableCell>{patient.user?.grandfatherName}</TableCell>
                <TableCell>{patient.user?.phoneNumber}</TableCell>
                <TableCell>{patient.patientType}</TableCell>
                <TableCell>{patient.user?.gender}</TableCell> 
                <TableCell>{patient.user?.address}</TableCell> 
                

                {/* <TableCell>
                  <span style={{ ...styles.statusBadge, backgroundColor: row.statusColor }}>
                    {row.status}
                  </span>
                </TableCell> */}
                <TableCell>
                  <MoreHorizIcon onClick={()=> handleDetails(patient._id)}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div style={styles.paginationContainer}>
        <span>Showing 1 to 8 of 235 entries</span>
        <Pagination count={235} variant="outlined" shape="rounded" />
        <div style={styles.pageSelector}>
          <span>Go to page</span>
          <Select
            size="small"
            defaultValue={1}
            sx={{ mx: 1, width: 60 }}
            variant="outlined"
          >
            {[...Array(235).keys()].map((page) => (
              <MenuItem key={page + 1} value={page + 1}>
                {page + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      </div>
            )}
      </Paper>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  actions: {
    display: "flex",
    alignItems: "center",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  pageSelector: {
    display: "flex",
    alignItems: "center",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "bold",
  },
};

export default ListOfPatientsMUI;





// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
//   TextField,
//   Button,
//   IconButton,
//   InputAdornment,
//   Pagination,
//   Select,
//   MenuItem,
//   Paper,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import DownloadIcon from "@mui/icons-material/Download";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// // Sample Data for the Table
// const patientsData = [
//   {
//     id: "#809776",
//     name: "Wade Warren",
//     age: 21,
//     gender: "Female",
//     ageGroup: "Adult",
//     lastVisit: "Jul 12, 2024",
//     nextAppointment: "Aug 22, 2024",
//     condition: "Acne",
//     status: "Improving",
//     statusColor: "orange",
//   },
//   {
//     id: "#540775",
//     name: "Darlene Robertson",
//     age: 27,
//     gender: "Male",
//     ageGroup: "Adult",
//     lastVisit: "Jun 12, 2024",
//     nextAppointment: "Aug 8, 2024",
//     condition: "Hypertension",
//     status: "Scheduled",
//     statusColor: "blue",
//   },
//   // Add more rows as needed...
// ];

// const ListOfPatientsMUI = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
//       <div style={styles.header}>
//         <h3 style={{ margin: 0 }}>Patient List</h3>
//         <div style={styles.actions}>
//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Search patient..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ mr: 2 }}
//           />
//           <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ mr: 2 }}>
//             Filter
//           </Button>
//           <Button variant="outlined" startIcon={<DownloadIcon />}>
//             Export
//           </Button>
//         </div>
//       </div>
      
//       {/* Table */}
//       <TableContainer>
//         <Table sx={{ minWidth: 650 }} aria-label="patient table">
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox color="primary" />
//               </TableCell>
//               <TableCell>No</TableCell>
//               <TableCell>ID</TableCell>
//               <TableCell>Patient Name</TableCell>
//               <TableCell>Age</TableCell>
//               <TableCell>Gender</TableCell>
//               <TableCell>Age Group</TableCell>
//               <TableCell>Last Visit</TableCell>
//               <TableCell>Next Appointment</TableCell>
//               <TableCell>Condition</TableCell>
             
//               <TableCell />
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {patientsData.map((row, index) => (
//               <TableRow key={row.id}>
//                 <TableCell padding="checkbox">
//                   <Checkbox color="primary" />
//                 </TableCell>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.age}</TableCell>
//                 <TableCell>{row.gender}</TableCell>
//                 <TableCell>{row.ageGroup}</TableCell>
//                 <TableCell>{row.lastVisit}</TableCell>
//                 <TableCell>{row.nextAppointment}</TableCell>

//                 <TableCell>
//                   <span style={{ ...styles.statusBadge, backgroundColor: row.statusColor }}>
//                     {row.status}
//                   </span>
//                 </TableCell>
//                 <TableCell>
//                   <IconButton>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <div style={styles.paginationContainer}>
//         <span>Showing 1 to 8 of 235 entries</span>
//         <Pagination count={235} variant="outlined" shape="rounded" />
//         <div style={styles.pageSelector}>
//           <span>Go to page</span>
//           <Select
//             size="small"
//             defaultValue={1}
//             sx={{ mx: 1, width: 60 }}
//             variant="outlined"
//           >
//             {[...Array(235).keys()].map((page) => (
//               <MenuItem key={page + 1} value={page + 1}>
//                 {page + 1}
//               </MenuItem>
//             ))}
//           </Select>
//         </div>
//       </div>
//     </Paper>
//   );
// };
