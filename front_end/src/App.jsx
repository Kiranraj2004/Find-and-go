import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ViewDetails from './pages/ViewDetails';

const App = () => {
   return (
    <div className="min-h-screen    ">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard></AdminDashboard>} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard></DoctorDashboard>}/>
          <Route path="/view-details/:hospitalId" element={<ViewDetails />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
