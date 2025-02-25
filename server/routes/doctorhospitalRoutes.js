const express = require("express");
const router = express.Router();
const { registerDoctorToHospital,getDoctorhospitals ,updateAvilableStatus } = require("../controllers/doctorhospitalController");

router.post("/register-hospital", registerDoctorToHospital);
router.get("/get/:doctorId", getDoctorhospitals);

router.put("/update-availability/:Id", updateAvilableStatus);


module.exports = router;
