require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Student Internship Portal API is running");
});

// Internship application API routes
app.use("/api", require("./routes/api"));

// Start server and connect to MongoDB
async function startServer() {
  try {
    // Check MongoDB connection string
    if (!process.env.MONGO_DB_URI) {
      throw new Error("MONGO_DB_URI is missing in .env");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("MongoDB connected successfully");

    // Start Express server
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error.message);
    process.exit(1);
  }
}

startServer();
