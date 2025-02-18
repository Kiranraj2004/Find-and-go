import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [adminEmail, setAdminEmail] = useState("admin@example.com"); // Replace with dynamic email
  const [newHospital, setNewHospital] = useState({ name: "", address: "" });

  // Fetch Hospitals Registered by Admin
  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/hospital/my-hospitals/${adminEmail}`);
      setHospitals(response.data.hospitals);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewHospital({ ...newHospital, [e.target.name]: e.target.value });
  };

  // Register a New Hospital
  const registerHospital = async () => {
    try {
      await axios.post("http://localhost:8000/api/hospital/register", {
        name: newHospital.name,
        address: newHospital.address,
        adminEmail
      });
      fetchHospitals(); // Refresh list
    } catch (error) {
      console.error("Error registering hospital:", error);
    }
  };

  // Delete Hospital
  const deleteHospital = async (hospitalId) => {
    try {
      await axios.delete(`http://localhost:8000/api/hospital/delete/${hospitalId}`);
      fetchHospitals();
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  const [editingHospital, setEditingHospital] = useState(null);
const [updatedHospital, setUpdatedHospital] = useState({ name: "", address: "" });

const handleEdit = (hospital) => {
  setEditingHospital(hospital);
  setUpdatedHospital({ name: hospital.name, address: hospital.address });
};

const handleUpdate = async () => {
  try {
    await axios.put(`http://localhost:5000/api/hospitals/update/${editingHospital._id}`, updatedHospital);
    fetchHospitals();
    setEditingHospital(null);
  } catch (error) {
    console.error("Error updating hospital:", error);
  }
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Register New Hospital */}
      <div className="mb-4 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Register New Hospital</h2>
        <input type="text" name="name" placeholder="Hospital Name" className="border p-2 mr-2" onChange={handleInputChange} />
        <input type="text" name="address" placeholder="Hospital Address" className="border p-2 mr-2" onChange={handleInputChange} />
        <button onClick={registerHospital} className="bg-blue-500 text-white px-4 py-2">Register</button>
      </div>

      {/* List of Hospitals */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Your Hospitals</h2>
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <div key={hospital._id} className="p-4 bg-white rounded shadow mb-2 flex justify-between">
              <div>
                <h3 className="text-lg font-bold">{hospital.name}</h3>
                <p className="text-gray-600">{hospital.address}</p>
              </div>
              <button onClick={() => deleteHospital(hospital._id)} className="bg-red-500 text-white px-4 py-2">Delete</button>
            </div>
          ))
        ) : (
          <p>No hospitals registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
