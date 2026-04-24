const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://lpu-troubleshooting3050.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
