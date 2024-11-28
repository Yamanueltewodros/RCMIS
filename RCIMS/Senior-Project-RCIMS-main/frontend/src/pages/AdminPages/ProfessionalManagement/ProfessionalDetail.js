// const ProfessionalDetail = () => {
           
//     return (
//                    <div className="professional-details professional-card">
//                         <h3>Professional Details:</h3>
//                         <button
//                             className="back-button"
//                             onClick={handleBackToList}
//                         >
//                             Back to List
//                         </button>
//                         <h2 className="professional-name">
//                             Name:{" "}
//                             <span>{`${selectedProfessional.user?.name} ${selectedProfessional.user?.fatherName} ${selectedProfessional.user?.grandfatherName}`}</span>
//                         </h2>
//                         <div className="professional-info-grid">
//                             <p>
//                                 <strong>Specialty:</strong>{" "}
//                                 {selectedProfessional.speciality}
//                             </p>
//                             <p>
//                                 <strong>Phone Number:</strong>{" "}
//                                 {selectedProfessional.user?.phoneNumber}
//                             </p>
//                             <p>
//                                 <strong>Address:</strong>{" "}
//                                 {selectedProfessional.user?.address}
//                             </p>
//                             <p>
//                                 <strong>Age:</strong>{" "}
//                                 {calculateAge(
//                                     selectedProfessional.user?.dateOfBirth
//                                 )}
//                             </p>
//                             <p>
//                                 <strong>Gender:</strong>{" "}
//                                 {selectedProfessional.user?.gender}
//                             </p>
//                             <p>
//                                 <strong>Years of Experience:</strong>{" "}
//                                 {selectedProfessional.yearsOfExperience}
//                             </p>
//                             <p>
//                                 <strong>Qualifications:</strong>{" "}
//                                 {selectedProfessional.qualification}
//                             </p>
//                             <p>
//                                 <strong>Department: </strong>{" "}
//                                 {selectedProfessional.department}
//                             </p>
//                             <p>
//                                 <strong>Bio:</strong> {selectedProfessional.bio}
//                             </p>
//                             <p>
//                                 <strong>Languages:</strong>{" "}
//                                 {selectedProfessional.languagesSpoken.join(
//                                     ", "
//                                 )}
//                             </p>
//                             <p>
//                                 <strong>Working Hours:</strong>{" "}
//                                 {selectedProfessional.workingHours}
//                             </p>
//                         </div>
//                         <div className="status-wrapper">
//                             <span
//                                 className={`status-badge ${selectedProfessional.status}`}
//                             >
//                                 {selectedProfessional.status}
//                             </span>
//                         </div>
//                         <div className="professional-actions">
//                             <button
//                                 className="btn btn-edit"
//                                 onClick={() => handleEdit(selectedProfessional)}
//                             >
//                                 Edit
//                             </button>
//                             <button
//                                 className="btn btn-remove"
//                                 onClick={() =>
//                                     handleRemove(selectedProfessional._id)
//                                 }
//                             >
//                                 Remove
//                             </button>
//                         </div>
//                     </div>
//    );
// }

// export default ProfessionalDetail