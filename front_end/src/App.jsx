import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ViewDetails from './pages/ViewDetails';


const App = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    fetch(`${url}/warmup`)
      .then((res) => res.json())
      .then((data) => console.log("Server warmed up:", data))
      .catch((err) => console.error("Warm-up failed:", err));
  }, []);  
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
