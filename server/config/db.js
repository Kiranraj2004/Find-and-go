const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async (res) => { // Pass the response object
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message }); // Send error response
    process.exit(1);
  }
};

module.exports = connectDB;
