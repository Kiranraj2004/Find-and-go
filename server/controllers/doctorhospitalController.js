const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const HospitalDoctor = require("../models/HospitalDoctor");

const registerDoctorToHospital = async (req, res) => {
  try {
    const { email, hospitalId, specialization } = req.body;
    console.log("Doctor email:", email);
    console.log("TomTom hospital ID:", hospitalId);
    console.log("Specialization:", specialization);

    // Find the doctor by email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    console.log("Found doctor with ID:", doctor._id);

    // Find the hospital with the given tomtomId
    const hospital = await Hospital.findOne({ tomtomId: hospitalId });
    if (!hospital) {
      console.log(hospital);
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }
    console.log("Found hospital with MongoDB ID:", hospital._id);

    // Now use the MongoDB ID of the hospital
    const mongoHospitalId = hospital._id;

    // Check if the doctor is already registered in the same hospital
    const existingEntry = await HospitalDoctor.findOne({ 
      doctor: doctor._id, 
      hospitalId: mongoHospitalId 
    });

    if (existingEntry) {
      console.log(existingEntry);
      return res.status(200).json({ 
        success: true, 
        message: "Doctor already registered for this hospital" 
      });
    }
    console.log("Doctor not registered for this hospital yet");

    // Create new HospitalDoctor entry
    const hospitalDoctor = new HospitalDoctor({
      doctor: doctor._id,
      hospitalId: mongoHospitalId, // Using MongoDB ID
      specialization,
      availability: { 
        timeSlots: [], 
        currentStatus: "Available" 
      }
    });

    await hospitalDoctor.save();

    // Update the doctor's registered hospitals
    doctor.registeredHospitals.push(hospitalDoctor._id);
    await doctor.save();

    res.status(201).json({ 
      success: true, 
      message: "Doctor registered to hospital", 
      hospitalDoctor 
    });
  } catch (error) {
    console.error("Error registering doctor to hospital:", error);
    res.status(500).json({ success: false, error: "Error registering doctor to hospital", details: error.message });
  }
};

const getDoctorhospitals = async (req, res) => {
  try {
    const doctorHospitals = await HospitalDoctor.find({ doctor: req.params.doctorId }).populate("hospitalId");

    res.json({ success: true, hospitals: doctorHospitals });
  } catch (error) {
    console.error("Error fetching doctor's hospitals:", error);
    res.status(500).json({ success: false, message: "Error fetching doctor's hospitals", details: error.message });
  }
}

const getAllDoctors = async (req, res) => {
  try {
    const { hospitalId } = req.params; // This is the TomTom ID
    console.log("TomTom Hospital ID:", hospitalId);
    
    // First, find the hospital with this TomTom ID
    const hospital = await Hospital.findOne({ tomtomId: hospitalId });
    
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    
    console.log("Found hospital with MongoDB ID:", hospital._id);
    
    // Now use the MongoDB ID to find all doctors
    const doctors = await HospitalDoctor.find({ hospitalId: hospital._id }).populate("doctor");
    
    if (!doctors.length) {
      return res.status(404).json({ message: "No doctors found for this hospital" });
    }
    
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors", details: error.message });
  }
};

const updateAvilableStatus = async (req, res) => {
  try {
    const hospitalDoctor = await HospitalDoctor.findById(req.params.Id);
    console.log(req.params.Id);

    if (!hospitalDoctor) {
      return res.status(404).json({ success: false, message: "Doctor-hospital record not found" });
    }
    hospitalDoctor.availability.currentStatus = hospitalDoctor.availability.currentStatus === "Available" ? "Not Available" : "Available";
    await hospitalDoctor.save();
    res.json({ success: true, message: "Availability updated", updatedStatus: hospitalDoctor.availability.currentStatus });
  } catch (error) {
    console.error("Error updating doctor's availability status:", error);
    res.status(500).json({ success: false, message: "Error updating doctor's availability status", details: error.message });
  }
}

const deletedoctorfromhospital = async (req, res) => {
  try {
    const { hospitalId, doctorId } = req.params;
    console.log("TomTom Hospital ID:", hospitalId);

    // Find and delete the doctor from the hospital
    const deletedEntry = await HospitalDoctor.findOneAndDelete({ _id: hospitalId });
    console.log(deletedEntry);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Doctor not found in this hospital" });
    }

    res.status(200).json({ message: "Doctor removed from hospital successfully" });
  } catch (error) {
    console.error("Error deleting doctor from hospital:", error);
    res.status(500).json({ message: "Error deleting doctor from hospital", details: error.message });
  }
};
module.exports = { registerDoctorToHospital, getDoctorhospitals, updateAvilableStatus, getAllDoctors, deletedoctorfromhospital };