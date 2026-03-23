const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const itemRoutes = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIX FOR DEPLOYMENT
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-url.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/items", itemRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Lost & Found API is running 🎒" });
});

// MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/lostfound";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  });