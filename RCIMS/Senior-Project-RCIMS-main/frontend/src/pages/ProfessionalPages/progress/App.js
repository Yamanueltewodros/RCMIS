import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProgressPage from './ProgressPage';
import AddProgress from './AddProgress';

function App() {
  return (
    <Router>  {/* Only one Router here */}
      <Routes>
        <Route path="/progress/:patientId" element={<ProgressPage />} />
        <Route path="/add-progress/:patientId" element={<AddProgress />} />
        {/* Other routes can go here */}
      </Routes>
    </Router>
  );
}

export default App;
