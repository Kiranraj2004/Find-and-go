const mongoose = require("mongoose");

const hospitalDoctorSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  specialization: { type: String, required: true },
  availability: {
    timeSlots: [{ start: String, end: String }], // Example: [{ start: "10:00 AM", end: "1:00 PM" }]
    currentStatus: { type: String, enum: ["Available", "Not Available"], default: "Available" }
  }
});

module.exports = mongoose.model("HospitalDoctor", hospitalDoctorSchema);
