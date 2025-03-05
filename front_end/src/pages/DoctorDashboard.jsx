"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react"
import { Bell, Hospital, UserPlus, X, CheckCircle, XCircle, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"


// Toast notification component
const Toast = ({ message, type, onClose }) => {
  if (!message) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center">
      <div
        className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md animate-fade-in ${
          type === "success"
            ? "bg-green-100 text-green-800 border border-green-200"
            : type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : type === "error" ? (
          <XCircle className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

const DoctorDashboard = () => {
  const { user, isAuthenticated } = useAuth0()
  const [doctor, setDoctor] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [hospitalId, setHospitalId] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [toast, setToast] = useState({ message: "", type: "" })
  const [registeredHospitals, setRegisteredHospitals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const url = import.meta.env.VITE_BACKEND_URL
  const navigate=useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setIsLoading(true)
      axios
        .get(`${url}/api/doctor/check/${user.email}`)
        .then((res) => {
          if (res.data.exists) {
            setDoctor(res.data.doctor)
            fetchDoctorHospitals(res.data.doctor._id)
          } else {
            setEmail(user.email)
          }
        })
        .catch((error) => {
          console.error("Error checking doctor:", error)
          showToast("Failed to load doctor information", "error")
        })
        .finally(() => setIsLoading(false))
    }
  }, [isAuthenticated, user])

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToast({ message: "", type: "" })
    }, 5000)
  }

  const fetchDoctorHospitals = async (doctorId) => {
    try {
      const res = await axios.get(`${url}/api/doctor-hospitals/get/${doctorId}`)
      setRegisteredHospitals(res.data.hospitals)
    } catch (error) {
      console.error("Error fetching doctor's hospitals:", error)
      showToast("Failed to load hospital information", "error")
    }
  }

  const handleRegister = async () => {
    if (!name.trim()) {
      showToast("Please enter your name", "error")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`${url}/api/doctor/register`, { name, email })
      setDoctor(res.data.doctor)
      fetchDoctorHospitals(res.data.doctor._id)
      showToast("Registration successful!", "success")
    } catch (error) {
      console.error("Error registering doctor:", error)
      showToast("Registration failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleHospitalRegister = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const email = user.email
      const response = await axios.post(`${url}/api/doctor-hospitals/register-hospital`, {
        email,
        hospitalId,
        specialization,
      })

      showToast(response.data.message, "success")
      fetchDoctorHospitals(doctor._id)
      // Clear form fields
      setHospitalId("")
      setSpecialization("")
    } catch (error) {
      console.error("Error registering doctor to hospital:", error)
      if (error.response) {
        showToast(error.response.data.message, "error")
      } else {
        showToast("Registration failed. Please try again.", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAvailability = async (hospitalDoctorId) => {
    try {
      setIsLoading(true)
      const res = await axios.put(`${url}/api/doctor-hospitals/update-availability/${hospitalDoctorId}`)
      setRegisteredHospitals((prevHospitals) =>
        prevHospitals.map((hospital) =>
          hospital._id === hospitalDoctorId
            ? { ...hospital, availability: { ...hospital.availability, currentStatus: res.data.updatedStatus } }
            : hospital,
        ),
      )
      showToast(`Availability updated to ${res.data.updatedStatus}`, "success")
    } catch (error) {
      console.error("Error updating availability:", error)
      showToast("Failed to update availability", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDoctorFromHospital = async (hospitalId, doctorId) => {
    if (!confirm("Are you sure you want to remove yourself from this hospital?")) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${url}/api/doctor-hospitals/delete/${hospitalId}/${doctorId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete doctor from hospital")
      }

      // Update state to reflect the removal
      setRegisteredHospitals((prevHospitals) => prevHospitals.filter((hospital) => hospital._id !== hospitalId))

      showToast("Successfully removed from hospital", "success")
    } catch (error) {
      console.error("Error deleting doctor from hospital:", error)
      showToast("Failed to remove from hospital", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access the doctor dashboard.</p>
          <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Login
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <UserPlus className="mr-2 h-6 w-6 text-primary" />
          Register as Doctor
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Dr. John Doe"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email is automatically set from your account</p>
          </div>
          <button
            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
            onClick={handleRegister}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Register as Doctor
          </button>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const hospitalCardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  return (
    <motion.div className="max-w-4xl mx-auto p-6" initial="hidden" animate="visible" variants={containerVariants}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />

      <motion.div className="bg-white rounded-lg shadow-md p-6 mb-6" variants={itemVariants}>
        <motion.h1
          className="text-2xl font-bold text-blue-600 mb-4 flex items-center"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <UserPlus className="mr-2 h-6 w-6 text-primary" />
          Doctor Dashboard
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold text-gray-800">{doctor.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Doctor ID</p>
            <p className="font-semibold text-gray-800 font-mono">{doctor._id}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Hospital className="mr-2 h-5 w-5 text-primary" />
            Register for a Hospital
          </motion.h2>

          <motion.form
            onSubmit={handleHospitalRegister}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ID</label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                type="text"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                required
                placeholder="Enter hospital ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                required
                placeholder="e.g., Cardiology, Neurology"
              />
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <Hospital className="mr-2 h-5 w-5" />
              Register with Hospital
            </motion.button>
          </motion.form>
        </motion.div>

        <motion.div className="bg-white rounded-lg shadow-md p-6" variants={itemVariants}>
          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Hospital className="mr-2 h-5 w-5 text-primary" />
            Registered Hospitals
          </motion.h2>

          <AnimatePresence>
            {registeredHospitals.length === 0 ? (
              <motion.div
                className="text-center py-8 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: { delay: 0.2, duration: 0.5 },
                  }}
                >
                  <Hospital className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>You haven't registered with any hospitals yet.</p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence>
                  {registeredHospitals.map((hospital) => (
                    <motion.div
                      key={hospital._id}
                      variants={hospitalCardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                      className="p-4 border border-gray-200 rounded-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{hospital.hospitalId.name}</h3>
                        <motion.div className="flex items-center" layout>
                          <motion.span
                            layout
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              hospital.availability.currentStatus === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            {hospital.availability.currentStatus}
                          </motion.span>
                        </motion.div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Specialization:</span> {hospital.specialization}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
                            hospital.availability.currentStatus === "Available"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                          onClick={() => toggleAvailability(hospital._id)}
                        >
                          {hospital.availability.currentStatus === "Available" ? (
                            <>
                              <ToggleRight className="h-4 w-4 mr-1" /> Available
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-1" /> Unavailable
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                          onClick={() => deleteDoctorFromHospital(hospital._id, doctor._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

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

  )
}

export default DoctorDashboard

