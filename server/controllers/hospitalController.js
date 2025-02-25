  const Hospital = require("../models/Hospital");
const Admin = require("../models/Admin");

const registerHospital = async (req, res) => {
    try {
      // console.log("registerHospital");
      const { hospitalId, name, address, email } = req.body;
      // console.log(hospitalId,"name: ", name,"add :", address, "email: ", email);
  
      if (!hospitalId || !name || !address || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const admin = await Admin.findOne({ email: email });
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      const tomtomId=hospitalId;
  
      const existingHospital = await Hospital.findOne({ tomtomId: tomtomId});
      if (existingHospital) return res.status(400).json({ message: "Hospital already exists" });
  
      

      const hospital = new Hospital({ tomtomId, name, address, admin: admin._id });
      await hospital.save();
  
      admin.hospitals.push(hospital._id);
      await admin.save();
  
      res.status(201).json({ message: "Hospital registered successfully", hospital });
    } catch (error) {
      console.error("Error registering hospital:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  

  const getHospitalsByAdmin = async (req, res) => {
    try {
      const { adminEmail } = req.params;
      // console.log(adminEmail);
      
      const admin = await Admin.findOne({ email: adminEmail }).populate("hospitals");
      if (!admin) return res.status(404).json({ message: "Admin not found" });
  
      res.status(200).json({ hospitals: admin.hospitals });
    } catch (error) {
      // console.error("Error fetching hospitals:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  const updateHospitalDetails = async (req, res) => {
    try {
      const { hospitalId } = req.params;
      const { name, address } = req.body;
  
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) return res.status(404).json({ message: "Hospital not found" });
  
      if (name) hospital.name = name;
      if (address) hospital.address = address;
  
      await hospital.save();
      res.status(200).json({ message: "Hospital updated successfully", hospital });
    } catch (error) {
      console.error("Error updating hospital:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  const deleteHospital = async (req, res) => {
    try {
      const { hospitalId } = req.params;
  
      const hospital = await Hospital.findByIdAndDelete(hospitalId);
      if (!hospital) return res.status(404).json({ message: "Hospital not found" });
  
      // Remove hospital reference from the admin
      await Admin.updateOne(
        { _id: hospital.admin },
        { $pull: { hospitals: hospitalId } }
      );
  
      res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (error) {
      console.error("Error deleting hospital:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


   const checkhospital=async (req, res) => {
    const hospitalId = req.params.id;
    console.log("hospitalId",hospitalId);
    try {
      const hospital = await Hospital.find({ hospitalId });
       // Assuming MongoDB/Mongoose
       console.log("hospital",hospital);
     return res.json({ exists: !!hospital });
    } catch (error) {
      console.error("Error checking hospital:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
  
  
  
  // ✅ Make sure to export it correctly

  

module.exports = { registerHospital,getHospitalsByAdmin,updateHospitalDetails,deleteHospital,checkhospital };
