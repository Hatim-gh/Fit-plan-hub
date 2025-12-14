const Plan = require("../models/Plan");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

exports.getUserFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Plans from followed trainers
    const followedPlans = await Plan.find({
      trainer: { $in: user.following }
    }).populate("trainer", "name");

    // Purchased plans
    const subscriptions = await Subscription.find({
      user: req.user.id
    }).populate({
      path: "plan",
      populate: { path: "trainer", select: "name" }
    });

    res.json({
      followedTrainerPlans: followedPlans,
      purchasedPlans: subscriptions.map(s => s.plan)
    });
  } catch (error) {
    res.status(500).json({ message: "Feed fetch failed" });
  }
};
