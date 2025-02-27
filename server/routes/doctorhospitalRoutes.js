const express = require("express");
const router = express.Router();
const { registerDoctorToHospital,getDoctorhospitals ,updateAvilableStatus,getAllDoctors,deletedoctorfromhospital } = require("../controllers/doctorhospitalController");

router.post("/register-hospital", registerDoctorToHospital);
router.get("/get/:doctorId", getDoctorhospitals);

router.put("/update-availability/:Id", updateAvilableStatus);

router.get("/getalldoctors/:hospitalId", getAllDoctors);
router.delete("/delete/:hospitalId/:doctorId",deletedoctorfromhospital);


module.exports = router;
