const Admin = require("../models/Admin");

const registerAdmin = async (req, res) => {
  const { email } = req.body;
  // console.log(email);

  try {
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });

    admin = new Admin({ email, hospitals: [] });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};

const checkadmin = async (req, res) => {
  const email = req.params.email;

  // console.log("email1",email);
  try {
    let admin = await Admin.findOne({ email });
    // console.log(admin);
    res.json({ exists: !!admin, admin: admin });
  } catch (error) {
    console.error("Error checking admin:", error);
    res.status(500).json({ message: "Error checking admin", error: error.message });
  }
}

module.exports = { registerAdmin, checkadmin };
