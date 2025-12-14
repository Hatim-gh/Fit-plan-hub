const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const feedController = require("../controllers/feedController");

router.get("/", protect, feedController.getUserFeed);

module.exports = router;
