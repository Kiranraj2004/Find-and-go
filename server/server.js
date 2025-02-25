const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB=require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const doctorRoutes=require("./routes/doctorRoutes");

const doctorhospitalRouter=require("./routes/doctorhospitalRoutes");

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json()); // Properly parse JSON requests

// Connect to MongoDB
connectDB();

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
  });


app.use("/api/admin", adminRoutes);

app.use("/api/hospital", hospitalRoutes);

app.use("/api/doctor", doctorRoutes);

app.use("/api/doctor-hospitals", doctorhospitalRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });