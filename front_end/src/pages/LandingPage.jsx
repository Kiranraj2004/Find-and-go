"use client"

import { useState } from "react"
import AuthButton from "./LoginButton"
import TomTomMap from "@/components/TomTomMap"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"


const LandingPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const navigate=useNavigate();

  const loginadmin = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
  
    const email = user.email;
    // Hook for navigation
  
    if (isAuthenticated) {
      try {
        // Check if admin exists
        const response = await fetch(`http://localhost:8000/api/admin/check/${email}`);
        const data = await response.json();
        // console.log(data);
        let adminId;
        if (data.exists) {
          console.log("Admin exists");
          adminId = data.admin._id;
          const hospitalId = "";
      const name ="";
      const address = "";


          navigate("/admin-dashboard", { state: {  hospitalId,name,address,email } });
        } else {
          console.log("Admin does not exist");
  
          // Register admin
          const res = await fetch(`http://localhost:8000/api/admin/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });
  
          const registerData = await res.json();
          const hospitalId = "";
        const name ="";
        const address = "";
       


          navigate("/admin-dashboard", { state: {  hospitalId,name,address,email } });
        }
  
        // Redirect to Admin Dashboard with adminId and email as state
        
  
      } catch (error) {
        console.log(error);
      }
    }
  };
  const  logindoctor=async()=>{
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    navigate('/doctor-dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white ">
      {/* Navbar */}
          <header className="w-full p-2 flex items-center justify-between bg-white shadow-md sticky top-0 z-10">
      {/* Left Section: Logo */}
      <h1 className="text-2xl font-bold text-blue-600">Find & Go</h1>

      {/* Right Section: Admin & Doctors Dashboard + AuthButton */}
      <div className="flex items-baseline   ">
        <p  onClick={loginadmin} className="text-gray-700 mr-3 cursor-pointer ">Admin Dashboard</p>
        <p onClick={logindoctor} className="text-gray-700  mr-7 cursor-pointer">Doctors Dashboard</p>
        <AuthButton />
      </div>
    </header>


      {/* Main Content */}
      <main className=" w-full flex-grow flex flex-col  items-center justify-center  py-5">
        
          <h1 className="text-5xl font-bold text-gray-900 mb-0">Welcome to Find & Go</h1>
        
        {/* Search Bar */}
       
        
          <TomTomMap />
        
      </main>

      
    </div>
  )
}

export default LandingPage

