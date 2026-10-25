const express = require("express");
const router = express.Router();

const Application = require("../models/Application");

// GET: Retrieve all applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve applications"
    });
  }
});

// POST: Submit a new application
router.post("/applications", async (req, res) => {
  try {
    const { name, email, rollNumber, internship } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !rollNumber?.trim() ||
      !internship?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    const application = await Application.create({
      name,
      email,
      rollNumber,
      internship
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid application details"
      });
    }

    res.status(500).json({
      message: "Server error while saving application"
    });
  }
});

module.exports = router;