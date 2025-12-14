const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name: String,
following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  
email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["USER", "TRAINER"]
  }
});

module.exports = mongoose.model("User", userSchema);
