// list and save funcs
const Inquiry = require("../models/Inquiry");
async function submitInquiry(req, res) {
  try {
    const { email, body } = req.body;
    const inquiry = new Inquiry({
      email: email,
      body: body,
    });
    await inquiry.save();
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function listInqueries(req, res) {
  try {
    const inqueries = await Inquiry.find({}).select("email body");
    return res.status(200).json({ inqueries });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
module.exports = { submitInquiry, listInqueries };
