const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }], // List of hospital IDs admin manages
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
