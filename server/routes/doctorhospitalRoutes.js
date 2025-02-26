const express = require("express");
const router = express.Router();
const { registerDoctorToHospital,getDoctorhospitals ,updateAvilableStatus,getAllDoctors } = require("../controllers/doctorhospitalController");

router.post("/register-hospital", registerDoctorToHospital);
router.get("/get/:doctorId", getDoctorhospitals);

router.put("/update-availability/:Id", updateAvilableStatus);

router.get("/getalldoctors/:hospitalId", getAllDoctors);


module.exports = router;
