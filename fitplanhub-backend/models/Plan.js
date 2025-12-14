const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Plan", planSchema);
