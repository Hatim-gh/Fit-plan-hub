const User = require("../models/User");
const Plan = require("../models/Plan");

// GET TRAINER PROFILE WITH PLANS
exports.getTrainerProfile = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    
    const trainer = await User.findById(trainerId).select("name email");
    if (!trainer || trainer.role !== "TRAINER") {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const plans = await Plan.find({ trainer: trainerId });

    // Check if current user is following this trainer
    let isFollowing = false;
    if (req.user && req.user.id) {
      const currentUser = await User.findById(req.user.id);
      if (currentUser) {
        isFollowing = currentUser.following.some(id => id.toString() === trainerId);
      }
    }

    res.json({
      trainer,
      plans,
      isFollowing
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trainer profile" });
  }
};

