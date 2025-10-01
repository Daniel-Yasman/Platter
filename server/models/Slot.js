const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema(
  {
    slotKey: { type: String, required: true, unique: true, index: true }, // "YYYY-MM-DDTHH:mm" in Asia/Jerusalem
    used: { type: Number, required: true, default: 0, min: 0 },
    limit: { type: Number, required: true }, // mirror TABLE_LIMIT at creation
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", SlotSchema);
