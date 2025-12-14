const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const protect = require("../middleware/authMiddleware");

// CREATE PLAN
router.post("/", protect, planController.createPlan);

// GET ALL PLANS
router.get("/", planController.getAllPlans);

// GET PLANS BY TRAINER (protected - for trainer dashboard)
router.get("/trainer/my-plans", protect, planController.getPlansByTrainer);

// GET PLAN BY ID
router.get("/:id", planController.getPlanById);

// UPDATE PLAN
router.put("/:id", protect, planController.updatePlan);

// DELETE PLAN
router.delete("/:id", protect, planController.deletePlan);

module.exports = router;
