const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const sectionRoutes = require("./routes/sections");
const taskRoutes = require("./routes/tasks");

const app = express();

// CORS configuration (supports cross-origin requests from Vercel frontend)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// MongoDB connection with Serverless Connection Pooling
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is missing!");
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

// Ensure DB is connected for every incoming request
app.use(async (req, res, next) => {
  // Allow healthcheck route without blocking
  if (req.path === "/" || req.path === "/api") {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Database connection failed. Please check MongoDB Atlas access and MONGODB_URI environment variable.",
      error: err.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/tasks", taskRoutes);

// Health check endpoints
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "TaskChamber API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "TaskChamber API root is reachable",
  });
});

// Local development server listener
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start local server:", err.message);
    });
}

// Export for Vercel Serverless Function deployment
module.exports = app;
