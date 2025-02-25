const express = require("express");
const router = express.Router();
const { registerDoctor, getDoctor,checkdoctor } = require("../controllers/doctorController");

router.post("/register", registerDoctor);
router.get("/get/:email", getDoctor);
router.get("/check/:email", checkdoctor);

module.exports = router;
