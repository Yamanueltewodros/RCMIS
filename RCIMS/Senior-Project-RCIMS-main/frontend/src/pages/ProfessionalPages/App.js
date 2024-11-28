// App.js (or your main app file)
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import MySchedule from './components/MySchedule';
import AttachPatient from './components/AttachPatient';
import PatientManagement from './components/PatientManagement';
import DetachPatient from './components/DetachPatient';
import Reports from './components/Reports';
import Help from './components/Help';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<ProfessionalDashboard />} />
        <Route path="/schedule" element={<MySchedule />} />
        <Route path="/attach-patient" element={<AttachPatient />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/detach-patient" element={<DetachPatient />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/help" element={<Help />} />
        {/* Add any other routes you need */}
      </Routes>
    </Router>
  );
}

export default App;
