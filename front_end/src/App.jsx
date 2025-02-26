import React from 'react';
import {BrowserRouter , Route, Routes } from 'react-router-dom';


import LandingPage from './pages/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ViewDetails from './pages/ViewDetails';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard></AdminDashboard>} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard></DoctorDashboard>}/>
        <Route path="/view-details/:hospitalId" element={<ViewDetails />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
