import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard></AdminDashboard>} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard></DoctorDashboard>}/>
      </Routes>
    </Router>
  );
};

export default App;
