const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const subscriptionController = require("../controllers/subscriptionController");

// Subscribe to plan
router.post("/:planId", protect, subscriptionController.subscribePlan);

// Check subscription status
router.get("/check/:planId", protect, subscriptionController.checkSubscription);

module.exports = router;
