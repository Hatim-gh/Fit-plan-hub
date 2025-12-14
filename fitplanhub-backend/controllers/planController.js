const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");

// CREATE PLAN
exports.createPlan = async (req, res) => {
  try {
    if (req.user.role !== "TRAINER") {
      return res.status(403).json({ message: "Only trainers can create plans" });
    }

    const { title, description, price, duration } = req.body;

    const plan = new Plan({
      title,
      description,
      price,
      duration,
      trainer: req.user.id
    });

    await plan.save();
    res.json({ message: "Plan created successfully", plan });
  } catch (error) {
    res.status(500).json({ message: "Plan creation failed" });
  }
};

// GET ALL PLANS (for preview)
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().populate("trainer", "name");
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

// GET PLANS BY TRAINER
exports.getPlansByTrainer = async (req, res) => {
  try {
    const trainerId = req.params.trainerId || req.user?.id;
    const plans = await Plan.find({ trainer: trainerId }).populate("trainer", "name");
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

// GET SINGLE PLAN
exports.getPlanById = async (req, res) => {
    try {
      const plan = await Plan.findById(req.params.id)
        .populate("trainer", "name");
  
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
  
      // If not logged in → preview only
      if (!req.headers.authorization) {
        return res.json({
          title: plan.title,
          trainer: plan.trainer.name,
          price: plan.price
        });
      }
  
      // Logged-in user
      const token = req.headers.authorization.split(" ")[1];
      const decoded = require("jsonwebtoken").verify(
        token,
        process.env.JWT_SECRET
      );
  
      const subscribed = await Subscription.findOne({
        user: decoded.id,
        plan: plan._id
      });
  
      // Not subscribed → preview
      if (!subscribed) {
        return res.json({
          title: plan.title,
          trainer: plan.trainer.name,
          price: plan.price
        });
      }
  
      // Subscribed → full access
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan" });
    }
  };

// UPDATE PLAN
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (plan.trainer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this plan" });
    }

    const { title, description, price, duration } = req.body;

    plan.title = title || plan.title;
    plan.description = description || plan.description;
    plan.price = price || plan.price;
    plan.duration = duration || plan.duration;

    await plan.save();
    res.json({ message: "Plan updated successfully", plan });
  } catch (error) {
    res.status(500).json({ message: "Plan update failed" });
  }
};

// DELETE PLAN
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (plan.trainer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this plan" });
    }

    await plan.remove();
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Plan deletion failed" });
  }
};
