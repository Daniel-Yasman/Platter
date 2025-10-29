const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  email: String,
  body: String,
});
module.exports = mongoose.model("Inquiry", inquirySchema);
