const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  tomtomId: { type: String, required: true, unique: true }, // ID from TomTom Maps
  name: { type: String, required: true },
  address: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Reference to Admin
}, { timestamps: true });

const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;
