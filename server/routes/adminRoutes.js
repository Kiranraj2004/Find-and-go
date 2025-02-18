const express = require("express");
const router = express.Router();
const { registerAdmin ,checkadmin} = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.get("/check/:email",checkadmin );

module.exports = router;
