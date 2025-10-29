const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  stock: Number,
  description: { type: String, default: "None available" },
});

module.exports = mongoose.model("Food", foodSchema);
