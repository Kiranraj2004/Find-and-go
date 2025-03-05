import React, { useEffect, useState } from "react";

import { useLocation,useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Alert, AlertTitle, AlertDescription}from "@/components/ui/alert";
import { Separator } from "@radix-ui/react-separator";
import { Avatar,AvatarFallback,AvatarImage } from "@radix-ui/react-avatar";

import { 
  Hospital, 
  User, 
  Stethoscope, 
  Check, 
  X 
} from 'lucide-react';


const ViewDetails = () => {
  const location = useLocation();
  const { hospitalId } = useParams(); // Get hospitalId from the URL
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url=import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!hospitalId) {
      setError("No hospital ID provided");
      setLoading(false);
      return;
    }

    // Fetch both hospital details and doctors
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hospital details
        const hospitalRes = await fetch(`${url}/api/hospital/check/${hospitalId}`);
        const hospitalData = await hospitalRes.json();
        
        if (hospitalData.exists) {
          setHospital(hospitalData.hospitals[0]); // Get the first hospital from the array
        } else {
          setError("Hospital not found");
        }
        
        // Fetch doctors for the hospital
        const doctorsRes = await fetch(`${url}/api/doctor-hospitals/getalldoctors/${hospitalId}`);
        const doctorsData = await doctorsRes.json();
        
        if (doctorsData.success) {
          setDoctors(doctorsData.doctors);
        } else {
          console.log("No doctors found or error:", doctorsData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!hospital) return <div className="p-10">Hospital information not available</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Error Toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
        >
          <Alert variant="destructive" onClose={() => setError(null)}>
            <X className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Hospital Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 bg-primary/10">
            <Hospital className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">
                {hospital.name}
              </CardTitle>
              <p className="text-muted-foreground">{hospital.address}</p>
            </div>
          </CardHeader>
         
        </Card>
      </motion.div>

      {/* Doctors Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Available Doctors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {doctors.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctorData) => {
                  const doctor = doctorData.doctor;
                  return (
                    <motion.div
                      key={doctor._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border border-border rounded-lg p-4 bg-background hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {doctorData.specialization}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Availability
                          </span>
                          
                           
                          <button
                            className={`flex items-center px-3 py-1.5 text-sm rounded-md hover:bg-opacity-15
                              ${doctorData.availability?.currentStatus === "Available" 
                                ? "bg-green-500 text-white" 
                                : "bg-red-500 text-white"}`}
                          >
                            {doctorData.availability?.currentStatus || "Unknown"}
                          </button>

                          
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-secondary/20 rounded-lg border border-dashed border-border">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No doctors are currently registered with this hospital.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Button className="flex items-center ml-96 mt-8"
      onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </div>
  );

};

export default ViewDetails;