const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registeredHospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: "HospitalDoctor" }]
});

module.exports = mongoose.model("Doctor", doctorSchema);
