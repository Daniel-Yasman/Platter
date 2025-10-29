const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    time: Date,
    cart: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        quantity: Number,
      },
    ],
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
