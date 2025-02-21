import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const location = useLocation();
  const { adminId, email, hospitalId } = location.state || {}; // Extracting props from state

  const [hospitals, setHospitals] = useState([]);
  const [hospitalName, setHospitalName] = useState("");

  useEffect(() => {
    if (email) {
      fetchHospitals();
    }
  }, [email]);

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/hospital/my-hospitals/${email}`);
      const data = await res.json();
      setHospitals(data.hospitals);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const deleteHospital = async (hospitalId) => {
    try {
      await fetch(`http://localhost:8000/api/hospital/delete/${hospitalId}`, {
        method: "DELETE",
      });
      setHospitals(hospitals.filter((hospital) => hospital._id !== hospitalId));
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  const registerHospital = async () => {
    if (!hospitalName.trim()) {
      alert("Please enter a hospital name.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/hospital/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: email, name: hospitalName }),
      });

      const data = await res.json();
      if (data.success) {
        setHospitals([...hospitals, data.hospital]);
        setHospitalName(""); // Clear input field
      }
    } catch (error) {
      console.error("Error registering hospital:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
        <div className="mb-4">
          <p className="text-gray-700"><strong>Email:</strong> {email || "Not Logged In"}</p>
          <p className="text-gray-700"><strong>Admin ID:</strong> {adminId || "Not Assigned"}</p>
        </div>

        {/* Hospital Registration Form */}
        {hospitalId && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Register a Hospital</h3>
            <div className="flex gap-3 mt-2">
                <p>Hospital ID:</p>
              <input
                type="text"
                placeholder="Enter hospital id"
                className="border rounded-lg px-4 py-2 flex-grow"
                value={hospitalId}
                onChange={(e) => setHospitalName(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={registerHospital}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Display Hospitals */}
        <h3 className="text-lg font-semibold text-gray-700">Registered Hospitals</h3>
        {hospitals.length > 0 ? (
          <ul className="mt-2">
            {hospitals.map((hospital) => (
              <li
                key={hospital._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2 shadow-sm"
              >
                <span className="text-gray-800">{hospital.name} (ID: {hospital._id})</span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => deleteHospital(hospital._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hospitals registered.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
