import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const DoctorDashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [doctor, setDoctor] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [message, setMessage] = useState("");
  const [registeredHospitals, setRegisteredHospitals] = useState([]);
  const url=import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      axios.get(`${url}/api/doctor/check/${user.email}`)
        .then((res) => {
          if (res.data.exists) {
            setDoctor(res.data.doctor);
            fetchDoctorHospitals(res.data.doctor._id);
          } else {
            setEmail(user.email);
          }
        })
        .catch((error) => console.error("Error checking doctor:", error));
    }
  }, [isAuthenticated, user]);

  const fetchDoctorHospitals = async (doctorId) => {
    try {
      const res = await axios.get(`${url}/api/doctor-hospitals/get/${doctorId}`);
      setRegisteredHospitals(res.data.hospitals);
    } catch (error) {
      console.error("Error fetching doctor's hospitals:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${url}/api/doctor/register`, { name, email });
      setDoctor(res.data.doctor);
      fetchDoctorHospitals(res.data.doctor._id);
    } catch (error) {
      console.error("Error registering doctor:", error);
    }
  };

  const handleHospitalRegister = async (e) => {
    e.preventDefault();
    try {
      const email = user.email;
      const response = await axios.post(`${url}/api/doctor-hospitals/register-hospital`, {
        email,
        hospitalId,
        specialization
      });

      setMessage(response.data.message);
      fetchDoctorHospitals(doctor._id);
    } catch (error) {
      console.error("Error registering doctor to hospital:", error);
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  const toggleAvailability = async (hospitalDoctorId) => {
    try {
      const res = await axios.put(`${url}/api/doctor-hospitals/update-availability/${hospitalDoctorId}`);
      setRegisteredHospitals((prevHospitals) =>
        prevHospitals.map((hospital) =>
          hospital._id === hospitalDoctorId
            ? { ...hospital, availability: { ...hospital.availability, currentStatus: res.data.updatedStatus } }
            : hospital
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  if (!isAuthenticated) return <p>Please login first</p>;

  if (!doctor) {
    return (
      <div className="p-4 border rounded-md">
        <h2 className="text-xl font-semibold mb-3">Register as Doctor</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="w-full border p-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={handleRegister}>
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p><strong>Name:</strong> {doctor.name}</p>
        <p><strong>ID:</strong> {doctor._id}</p>
      </div>

      <div className="mt-6 p-4 border rounded-md">
        <h2 className="text-xl font-semibold mb-3">Register for a Hospital</h2>
        {message && <p className="text-green-600">{message}</p>}

        <form onSubmit={handleHospitalRegister}>
          <div className="mb-4">
            <label className="block text-gray-700">Hospital ID</label>
            <input
              type="text"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Specialization</label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Registered Hospitals</h2>
        {registeredHospitals.map((hospital) => (
          <div key={hospital._id} className="p-4 border rounded-md mb-3">
            <p><strong>Hospital Name:</strong> {hospital.hospitalId.name}</p>
            <p><strong>Specialization:</strong> {hospital.specialization}</p>
            <p><strong>Availability:</strong> {hospital.availability.currentStatus}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-2"
              onClick={() => toggleAvailability(hospital._id)}
            >
              Toggle Availability
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
