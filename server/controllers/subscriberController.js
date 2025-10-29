const Subscriber = require("../models/Subscriber");

async function newSubscriber(req, res) {
  try {
    const { email } = req.body;
    const newSub = new Subscriber({
      email: email,
    });
    await newSub.save();
    return res.status(200).json({ message: "Submission_successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

async function listSubscribers(req, res) {
  try {
    const subscribers = await Subscriber.find({}).select("email");
    return res.status(200).json({ subscribers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
module.exports = { newSubscriber, listSubscribers };
