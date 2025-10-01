const Food = require("../models/Food");

async function listFoods(req, res) {
  try {
    const foods = await Food.find({});
    return res.status(200).json({ foods });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
module.exports = { listFoods };
