const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  email: String,
});
module.exports = mongoose.model("Subscriber", subscriberSchema);
