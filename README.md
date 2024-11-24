 RCMIS


 Rehabilitation Center Management Information System (RCMIS)

 Overview

The Rehabilitation Center Management Information System (RCMIS) is a comprehensive platform designed to streamline operations in addiction recovery and rehabilitation centers. Built using the MERN (MongoDB, Express.js, React.js, Node.js) stack, the system offers a range of features including patient management, appointment scheduling, progress reporting, and AI-powered relapse prediction.

---

 Features

- User Roles: Role-based access for Admins, Professionals, and Patients.
- Patient Management: Add, view, edit, and discharge patients with detailed records.
- Appointment Scheduling: Automated and manual scheduling of appointments.
- Progress Reporting: Track patient recovery through customizable progress reports.
- AI Relapse Prediction: Predict the likelihood of patient relapse using machine learning.
- Secure Authentication: JWT-based authentication for secure access.
- Dynamic Navigation: Seamless navigation between system modules.

---

 Tech Stack
 Frontend:
- React.js: For building a dynamic and responsive user interface.
- Material-UI/Bootstrap: For modern and accessible UI components.
 Backend:
- Node.js: Runtime environment for server-side development.
- Express.js Backend framework for API development.

 Database:
- MongoDB: Document-oriented NoSQL database for storing system data.

 Additional Tools:
- Axios: For making API calls.
- JWT (JSON Web Tokens): For secure authentication.
- CatBoost: For implementing the AI relapse prediction model.

---

 Installation

Prerequisites:
- Node.js and npm installed.
- MongoDB installed and running locally or remotely.
- Git for version control.

 Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rcims.git
   cd rcims
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `/backend` directory with the following:
     ```
     MONGO_URI=mongodb://localhost:27017/rcims
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

5. Start the backend server:
   ```bash
   cd ../backend
   npm start
   ```

6. Start the frontend server:
   ```bash
   cd ../frontend
   npm start
   ```

7. Open the app in your browser at `http://localhost:3000`.

---

 Folder Structure


---

 API Endpoints

 Authentication
- POST `/api/auth/login` - User login.
- POST `/api/auth/register` - Register a new user.

Patients
- GET `/api/patients` - Get all patients.
- POST `/api/patients` - Add a new patient.
- PUT `/api/patients/:id` - Update a patient.
- DELETE `/api/patients/:id` - Delete a patient.

 Appointments
- GET `/api/appointments` - Get all appointments.
- POST `/api/appointments` - Create a new appointment.

---

 Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes.
4. Push to your branch and create a Pull Request.

---

 License

This project is licensed under the **MIT License**.

---

 Contact

For questions or feedback, contact:

Yamanuel Tewodros  
📧 Email: yamanueltewodros@gmail.com  

