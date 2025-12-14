const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const followController = require("../controllers/followController");

router.post("/follow/:trainerId", protect, followController.followTrainer);
router.post("/unfollow/:trainerId", protect, followController.unfollowTrainer);
router.get("/following", protect, followController.getFollowing);

module.exports = router;
