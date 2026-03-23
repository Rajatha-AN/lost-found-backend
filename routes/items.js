// routes/items.js — API routes for lost/found items

const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// ─── GET /api/items ─────────────────────────────────────────────
// Fetch all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: err.message,
    });
  }
});

// ─── POST /api/items ────────────────────────────────────────────
// Create item + find matches
router.post("/", async (req, res) => {
  const { title, type, description, location, contact, date } = req.body;

  // Validation
  if (!title || !type || !description || !location || !contact) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields",
    });
  }

  try {
    // Save new item
    const newItem = new Item({
      title,
      type,
      description,
      location,
      contact,
      date: date || Date.now(),
    });

    const savedItem = await newItem.save();

    // ─── MATCHING LOGIC ─────────────────────────────────────────
    const oppositeType = type === "Lost" ? "Found" : "Lost";

    // combine all text fields
    const words = `${title} ${description} ${location}`
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    // create strict word match regex
    const regexPattern = words.map((w) => `\\b${w}\\b`).join("|");

    const matches =
      words.length > 0
        ? await Item.find({
            _id: { $ne: savedItem._id },
            type: oppositeType,
            $or: [
              { title: { $regex: regexPattern, $options: "i" } },
              { description: { $regex: regexPattern, $options: "i" } },
              { location: { $regex: regexPattern, $options: "i" } },
            ],
          }).limit(5)
        : [];

    // ─── RESPONSE ─────────────────────────────────────────────
    res.status(201).json({
      success: true,
      data: savedItem,
      matches, // 👈 frontend uses this
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: err.message,
    });
  }
});

// ─── DELETE /api/items/:id ─────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: err.message,
    });
  }
});

module.exports = router;