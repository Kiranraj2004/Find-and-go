const express = require("express");
const router = express.Router();
const { registerHospital,getHospitalsByAdmin,updateHospitalDetails,deleteHospital,checkhospital } = require("../controllers/hospitalController"); // Ensure this path is correct


if (!registerHospital) {
  console.error("⚠️ registerHospital function is not defined or imported!");
}
router.get("/check/:id",checkhospital);

router.delete("/delete/:hospitalId", deleteHospital);

router.put("/update/:hospitalId", updateHospitalDetails);

router.get("/my-hospitals/:adminEmail", getHospitalsByAdmin);

router.post("/register/:email", registerHospital); // Ensure this function exists

module.exports = router;
