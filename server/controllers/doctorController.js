const Doctor = require("../models/Doctor");

// 1️⃣ Register Doctor
const registerDoctor = async (req, res) => {
  try {
    const { name, email } = req.body;

    let doctor = await Doctor.findOne({ email });
    if (!doctor) {
      doctor = new Doctor({ name, email });
      await doctor.save();
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// 2️⃣ Register Doctor to Hospital


// 3️⃣ Get Doctor Data
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.params.email }).populate("registeredHospitals");
    if (!doctor) return res.status(404).json({ success: false, error: "Doctor not found" });

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const checkdoctor = async (req, res) => {
    const email = req.params.email;
    try{
        let doctor = await Doctor.findOne({ email });
        res.json({ exists:!!doctor, doctor: doctor });
    }
    catch(error){
        console.error("Error checking doctor:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { registerDoctor, getDoctor, checkdoctor };
