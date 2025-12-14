const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const followRoutes = require("./routes/followRoutes");
const feedRoutes = require("./routes/feedRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const authRoutes = require("./routes/authRoutes"); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscribe", subscriptionRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/trainer", trainerRoutes);

app.get("/", (req, res) => {
  res.send("FitPlanHub backend running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
