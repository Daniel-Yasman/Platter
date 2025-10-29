const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema(
  {
    // slotKey stores date
    slotKey: { type: String, required: true, unique: true, index: true }, // "YYYY-MM-DDTHH:mm" in Asia/Jerusalem
    // increments or decrements when needed
    used: { type: Number, required: true, default: 0, min: 0 },
    // mirrors TABLE_LIMIT at creation
    limit: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", SlotSchema);
