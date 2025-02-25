// ... other imports remain the same
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const location = useLocation();
  const [adminId, setAdminId] = useState("");
  const { hospitalId, name, address, email } = location.state || {};

  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate=useNavigate();

  // Separate useEffect for debugging current state
  useEffect(() => {
    // console.log("Current hospitals state:", hospitals);
  }, [hospitals]);

  useEffect(() => {
    if (email) {
      // console.log("Email received:", email);
      fetchAdminAndHospitals();
    } else {
      // console.log("No email in location state");
    }
  }, [email]);

  const fetchAdminAndHospitals = async () => {
    try {
      // console.log("Starting admin check...");
      const adminResponse = await fetch(`http://localhost:8000/api/admin/check/${email}`);
      const adminData = await adminResponse.json();
      // console.log("Admin check response:", adminData);

      if (adminData.exists) {
        // console.log("Admin exists, setting adminId...");
        const currentAdminId = adminData.admin._id;
        setAdminId(currentAdminId);

        // console.log("Fetching hospitals for email:", email);
        const hospitalsResponse = await fetch(`http://localhost:8000/api/hospital/my-hospitals/${email}`);
        
        // Log the raw response
        // console.log("Raw hospitals response:", hospitalsResponse);
        
        const hospitalsData = await hospitalsResponse.json();
        // console.log("Parsed hospitals data:", hospitalsData);

        // Check the structure of hospitalsData
        if (Array.isArray(hospitalsData)) {
          // console.log("Setting hospitals state with array:", hospitalsData);
          setHospitals(hospitalsData);
        } else if (hospitalsData.hospitals) { // If your API returns { hospitals: [] }
          // console.log("Setting hospitals from data.hospitals:", hospitalsData.hospitals);
          setHospitals(hospitalsData.hospitals);
        } else {
          // console.error("Unexpected hospitals data structure:", hospitalsData);
          setHospitals([]);
        }
      } else {
        // console.log("Admin does not exist");
        setHospitals([]);
      }
    } catch (error) {
      // console.error("Error in fetchAdminAndHospitals:", error);
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHospital = async (hospitalId) => {
    try {
      await fetch(`http://localhost:8000/api/hospital/delete/${hospitalId}`, {
        method: "DELETE",
      });
      setHospitals(prevHospitals => 
        prevHospitals.filter((hospital) => hospital._id !== hospitalId)
      );
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  const registerHospital = async () => {
    try {
      console.log("Registering hospital with:", { hospitalId, name, address, email });
      const tmp= await fetch(`http://localhost:8000/api/hospital/check/${hospitalId}`);
      const data1 = await tmp.json();
      
      console.log(data1);
      if(data1.exists){
        alert("Hospital ID already exists");
        return;
      }
      const res = await fetch(`http://localhost:8000/api/hospital/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId, name, address, email }),
      });

      const data = await res.json();
      console.log("Registration response:", data);
        fetchAdminAndHospitals();
    } catch (error) {
      console.error("Error registering hospital:", error);
    }
  };

  // Rest of your component remains the same...
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

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
            <div className="flex flex-col gap-3 mt-2">
              {/* Hospital ID */}
              <div className="flex gap-3 mt-2">
                <p>Hospital ID:</p>
                <input
                  type="text"
                  placeholder="Enter hospital id"
                  className="border rounded-lg px-4 py-2 flex-grow"
                  value={hospitalId}
                  readOnly
                />
              </div>

              {/* Hospital Name */}
              <div className="flex gap-3 mt-2">
                <p>Hospital name:</p>
                <input
                  type="text"
                  placeholder="Enter hospital name"
                  className="border rounded-lg px-4 py-2 flex-grow"
                  value={name}
                  readOnly
                />
              </div>

              {/* Hospital Address */}
              <div className="flex gap-3 mt-2">
                <p>Hospital address:</p>
                <input
                  type="text"
                  placeholder="Enter hospital address"
                  className="border rounded-lg px-4 py-2 flex-grow"
                  value={address}
                  readOnly
                />
              </div>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
              onClick={registerHospital}
            >
              Register
            </button>
          </div>
        )}

        {/* Display Hospitals */}
        <h3 className="text-lg font-semibold text-gray-700">Registered Hospitals</h3>
        {hospitals && hospitals.length > 0 ? (
          <ul className="mt-2">
            {hospitals.map((hospital) => (
              <li
                key={hospital.tomtomId}
                className="fle  x justify-between items-center  flex-col bg-gray-50 p-3 rounded-lg mb-2 shadow-sm"
              >
                {hospital.name} (hospitalID: {hospital.tomtomId})
                <span className=" flex
                text-sm text-gray-500">Address: {hospital.address}</span>
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


        <button
        className="mt-6 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
        onClick={() => navigate(-1)}
       >
        Go back
      </button>
      </div>

     
     
    </div>
  );
};

export default AdminDashboard;