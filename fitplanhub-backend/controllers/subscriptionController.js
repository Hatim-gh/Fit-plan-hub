const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

// PURCHASE PLAN (simulate payment)
exports.subscribePlan = async (req, res) => {
  try {
    const planId = req.params.planId;
    const userId = req.user.id;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const existing = await Subscription.findOne({
      user: userId,
      plan: planId
    });

    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const subscription = new Subscription({
      user: userId,
      plan: planId
    });

    await subscription.save();

    res.json({ message: "Plan subscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Subscription failed" });
  }
};

// CHECK IF USER IS SUBSCRIBED
exports.checkSubscription = async (req, res) => {
  try {
    const planId = req.params.planId;
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      user: userId,
      plan: planId
    });

    res.json({ isSubscribed: !!subscription });
  } catch (error) {
    res.status(500).json({ message: "Failed to check subscription" });
  }
};