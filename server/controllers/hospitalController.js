const Hospital = require("../models/Hospital");
const Admin = require("../models/Admin");
const HospitalDoctor = require("../models/HospitalDoctor");

const registerHospital = async (req, res) => {
  try {
    const { hospitalId, name, address, email } = req.body;

    if (!hospitalId || !name || !address || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email: email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    const tomtomId = hospitalId;

    const existingHospital = await Hospital.findOne({ tomtomId: tomtomId });
    if (existingHospital) return res.status(400).json({ message: "Hospital already exists" });

    const hospital = new Hospital({ tomtomId, name, address, admin: admin._id });
    await hospital.save();

    admin.hospitals.push(hospital._id);
    await admin.save();

    res.status(201).json({ message: "Hospital registered successfully", hospital });
  } catch (error) {
    console.error("Error registering hospital:", error);
    res.status(500).json({ message: "Error registering hospital", details: error.message });
  }
};

const getHospitalsByAdmin = async (req, res) => {
  try {
    const { adminEmail } = req.params;

    const admin = await Admin.findOne({ email: adminEmail }).populate("hospitals");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ hospitals: admin.hospitals });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Error fetching hospitals", details: error.message });
  }
};

const updateHospitalDetails = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { name, address } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    if (name) hospital.name = name;
    if (address) hospital.address = address;

    await hospital.save();
    res.status(200).json({ message: "Hospital updated successfully", hospital });
  } catch (error) {
    console.error("Error updating hospital:", error);
    res.status(500).json({ message: "Error updating hospital", details: error.message });
  }
};

const deleteHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Find and delete the hospital
    const hospital = await Hospital.findByIdAndDelete(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Remove hospital reference from the admin
    await Admin.updateOne(
      { _id: hospital.admin },
      { $pull: { hospitals: hospitalId } }
    );

    // Delete all doctors registered under this hospital
    await HospitalDoctor.deleteMany({ hospitalId });

    res.status(200).json({ message: "Hospital and its doctors deleted successfully" });
  } catch (error) {
    console.error("Error deleting hospital:", error);
    res.status(500).json({ message: "Error deleting hospital", details: error.message });
  }
};

const checkhospital = async (req, res) => {
  const hospitalId = req.params.id;
  try {
    const hospital = await Hospital.find({ tomtomId: hospitalId });
    if (hospital.length == 0) return res.json({ exists: false, hospitals: hospital });
    return res.json({ exists: true, hospitals: hospital });
  } catch (error) {
    console.error("Error checking hospital:", error);
    res.status(500).json({ error: "Error checking hospital", details: error.message });
  }
};

module.exports = { registerHospital, getHospitalsByAdmin, updateHospitalDetails, deleteHospital, checkhospital };
