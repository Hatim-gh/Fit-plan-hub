const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainerController");
const protect = require("../middleware/authMiddleware");

// GET TRAINER PROFILE WITH PLANS (optional auth for isFollowing check)
router.get("/:trainerId", protect, trainerController.getTrainerProfile);

module.exports = router;

