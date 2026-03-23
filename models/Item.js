// models/Item.js — Mongoose schema for lost/found items

const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    // Name/title of the item
    title: {
      type: String,
      required: [true, "Item title is required"],
      trim: true,
    },

    // Whether the item was lost or found
    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: [true, "Item type (Lost/Found) is required"],
    },

    // Detailed description of the item
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    // Where the item was lost or found
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    // Contact information for the reporter
    contact: {
      type: String,
      required: [true, "Contact info is required"],
      trim: true,
    },

    // Date the item was lost/found (defaults to now)
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", ItemSchema);
