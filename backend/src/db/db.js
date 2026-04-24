const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 If using Atlas, make sure your IP is whitelisted at:`);
    console.error(`   https://cloud.mongodb.com → Network Access → Add IP`);
    console.error(`   Or allow access from anywhere: 0.0.0.0/0`);
    process.exit(1);
  }
};

module.exports = connectDB;
