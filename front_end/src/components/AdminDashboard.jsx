import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminLoadingSkeleton } from "./ui/AdminSkeleton";

const AdminDashboard = () => {
  const location = useLocation();
  const [adminId, setAdminId] = useState("");
  const { hospitalId, name, address, email } = location.state || {};

  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: null, type: null, visible: false });
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (email) {
      fetchAdminAndHospitals();
    }
  }, [email]);

  // Auto-hide toast after 20 seconds
  useEffect(() => {
    let timer;
    if (toast.visible) {
      timer = setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [toast.visible]);

  const showToast = (message, type = "success") => {
    // Extract message from backend response if it exists
    const displayMessage = message.message || message;
    setToast({ message: displayMessage, type, visible: true });
  };

  const fetchAdminAndHospitals = async () => {
    try {
      const adminResponse = await fetch(`${url}/api/admin/check/${email}`);
      const adminData = await adminResponse.json();

      if (adminData.exists) {
        const currentAdminId = adminData.admin._id;
        setAdminId(currentAdminId);

        const hospitalsResponse = await fetch(`${url}/api/hospital/my-hospitals/${email}`);
        const hospitalsData = await hospitalsResponse.json();

        if (Array.isArray(hospitalsData)) {
          setHospitals(hospitalsData);
        } else if (hospitalsData.hospitals) {
          setHospitals(hospitalsData.hospitals);
        } else {
          setHospitals([]);
        }
      } else {
        setHospitals([]);
      }
    } catch (error) {
      showToast("Error fetching data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHospital = async (hospitalId) => {
    try {
      const response = await fetch(`${url}/api/hospital/delete/${hospitalId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      setHospitals(prevHospitals => 
        prevHospitals.filter((hospital) => hospital._id !== hospitalId)
      );
      showToast(data.message || "Hospital deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting hospital", "error");
    }
  };

  const registerHospital = async () => {
    try {
      const tmp = await fetch(`${url}/api/hospital/check/${hospitalId}`);
      const data1 = await tmp.json();

      if (data1.exists) {
        showToast("Hospital ID already exists", "error");
        return;
      }
      
      const res = await fetch(`${url}/api/hospital/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId, name, address, email }),
      });

      const data = await res.json();
      fetchAdminAndHospitals();
      showToast(data.message || "Hospital registered successfully", "success");
    } catch (error) {
      showToast("Error registering hospital", "error");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/5"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </div>
  
      {/* Toast notification */}
      <>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-xl min-w-64 max-w-md ${
              toast.type === "error" 
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
                : "bg-gradient-to-r from-green-500 to-green-600 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {toast.type === "error" ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {toast.message}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {toast.message}
                  </span>
                )}
              </motion.span>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setToast({ ...toast, visible: false })}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </>
  
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center w-full p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="bg-card shadow-xl rounded-2xl p-6 w-full max-w-6xl mx-auto border border-border/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Admin Dashboard
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 bg-primary/10 p-6 rounded-xl border border-primary/20 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-semibold">{email || "Not Logged In"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admin ID</p>
                  <p className="font-semibold font-mono">{adminId || "Not Assigned"}</p>
                </div>
              </div>
            </div>
          </motion.div>
  
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-primary/30 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
                />
              </div>
            </motion.div>
          ) : (
            <>
              {hospitalId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                  className="mb-8 bg-card shadow-lg rounded-xl p-6 border border-border"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold text-center mb-6 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Register a Hospital
                    </h3>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="flex flex-col"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="mb-2 text-sm font-medium text-muted-foreground">Hospital ID:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter hospital id"
                          className="border rounded-lg px-4 py-3 bg-background focus:ring-2 focus:ring-primary focus:outline-none w-full pl-10"
                          value={hospitalId}
                          readOnly
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="mb-2 text-sm font-medium text-muted-foreground">Hospital Name:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter hospital name"
                          className="border rounded-lg px-4 py-3 bg-background focus:ring-2 focus:ring-primary focus:outline-none w-full pl-10"
                          value={name}
                          readOnly
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex flex-col md:col-span-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="mb-2 text-sm font-medium text-muted-foreground">Hospital Address:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter hospital address"
                          className="border rounded-lg px-4 py-3 bg-background focus:ring-2 focus:ring-primary focus:outline-none w-full pl-10"
                          value={address}
                          readOnly
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-6 py-3 rounded-lg w-full transition-all duration-200 font-medium flex items-center justify-center"
                      onClick={registerHospital}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Register Hospital
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
  
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-card shadow-lg rounded-xl p-6 w-full border border-border"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-center mb-6 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Registered Hospitals
                  </h3>
                </motion.div>
                
                {hospitals && hospitals.length > 0 ? (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {hospitals.map((hospital, index) => (
                      <motion.div
                        key={hospital.tomtomId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        whileHover={{ scale: 1.01, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                        className="flex flex-col md:flex-row justify-between items-center bg-background p-5 rounded-xl shadow-sm border border-border hover:border-primary/30 transition-all duration-200"
                      >
                        <div className="flex flex-col md:w-1/3 mb-3 md:mb-0">
                          <span className="font-semibold text-lg">{hospital.name}</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <svg className="w-4 h-4 mr-1 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            ID: {hospital.tomtomId}
                          </span>
                        </div>
                        <div className="md:w-1/2 my-2 md:my-0 text-center md:text-left">
                          <span className="text-sm flex items-center justify-center md:justify-start">
                            <svg className="w-4 h-4 mr-1 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{hospital.address}</span>
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-destructive/90 hover:bg-destructive text-destructive-foreground px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                          onClick={() => deleteHospital(hospital._id)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-background p-10 rounded-xl text-center border border-dashed border-border flex flex-col items-center"
                  >
                    <svg className="w-16 h-16 text-muted-foreground/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-muted-foreground text-lg font-medium">No hospitals registered yet.</p>
                    <p className="text-sm mt-2 text-muted-foreground/70">Register a new hospital to see it here</p>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
  
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center"
              onClick={() => navigate(-1)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );


};

export default AdminDashboard;