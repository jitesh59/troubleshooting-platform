require("dotenv").config();
const app = require("../src/app");
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is missing");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Serverless MongoDB Connected");
  } catch (err) {
    console.error("❌ Serverless MongoDB Connection Error:", err.message);
  }
};

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
