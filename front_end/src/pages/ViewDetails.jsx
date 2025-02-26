import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ViewDetails = () => {
  const location = useLocation();
  const { hospitalId } = location.state || {}; // Get hospitalId from navigation state
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url=import.meta.env.VITE_BACKEND_URL;

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
    <div className="max-w-4xl mx-auto p-6">
      {/* Hospital Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{hospital.name}</h1>
        <div className="mt-4 text-gray-600">
          <p className="text-lg">{hospital.address}</p>
          <p className="mt-2">
            <span className="font-semibold">Phone:</span> {hospital.phoneNumber || "Not available"}
          </p>
          <div className="mt-2">
            <span className="font-semibold">Services:</span> 
            <p className="mt-1">{hospital.services?.join(", ") || "Information not available"}</p>
          </div>
          <p className="mt-2">
            <span className="font-semibold">Open Hours:</span> {hospital.openingHours || "Information not available"}
          </p>
        </div>
      </div>

      {/* Doctors Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Doctors</h2>
        
        {doctors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {doctors.map((doctorData) => {
              const doctor = doctorData.doctor; // Access the nested doctor object
              return (
                <div key={doctor._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 text-blue-800 p-3 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">{doctor.firstName} {doctor.lastName}</h3>
                  </div>
                  
                  <div className="text-gray-600">
                    <p className="mb-2">
                      <span className="font-medium">Specialization:</span> {doctorData.specialization}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Email:</span> {doctor.email}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Phone:</span> {doctor.phoneNumber || "Not available"}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${doctorData.availability?.currentStatus === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {doctorData.availability?.currentStatus || "Unknown"}
                      </span>
                    </p>
                    
                    {doctorData.availability?.timeSlots && doctorData.availability.timeSlots.length > 0 ? (
                      <div>
                        <span className="font-medium">Available Times:</span>
                        <ul className="mt-1 pl-5 list-disc">
                          {doctorData.availability.timeSlots.map((slot, index) => (
                            <li key={index}>{slot.start} to {slot.end}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No specific time slots available</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <p className="mt-2 text-gray-500">No doctors are currently registered with this hospital.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;