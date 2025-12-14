const User = require("../models/User");

// FOLLOW TRAINER
exports.followTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const trainerId = req.params.trainerId;

    if (user.following.includes(trainerId)) {
      return res.status(400).json({ message: "Already following" });
    }

    user.following.push(trainerId);
    await user.save();

    res.json({ message: "Trainer followed" });
  } catch (error) {
    res.status(500).json({ message: "Follow failed" });
  }
};

// UNFOLLOW TRAINER
exports.unfollowTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const trainerId = req.params.trainerId;

    user.following = user.following.filter(
      id => id.toString() !== trainerId
    );

    await user.save();

    res.json({ message: "Trainer unfollowed" });
  } catch (error) {
    res.status(500).json({ message: "Unfollow failed" });
  }
};

// GET FOLLOWED TRAINERS
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("following", "name email");

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch followed trainers" });
  }
};
