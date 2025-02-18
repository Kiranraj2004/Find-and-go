"use client"

import { useState } from "react"
import AuthButton from "./LoginButton"
import TomTomMap from "@/components/TomTomMap"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

const LandingPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white ">
      {/* Navbar */}
      <header className="w-full p-4 flex justify-between items-center bg-white  shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">Find & Go</h1>
        <AuthButton />
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

