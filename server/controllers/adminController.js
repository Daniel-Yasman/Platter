const Food = require("../models/Food");
const Reservation = require("../models/Reservation");
const User = require("../models/User");

async function createFood(req, res) {
  try {
    // req.params = what get's sent in the url of a POST
    const { adminId } = req.params;
    // find by ID in the DB
    const user = await User.findById(adminId);
    // Simple admin check
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "unauthorized" });

    // What the body (the form) sends
    const { name, price, image, stock, description } = req.body;
    const newMeal = new Food({
      name,
      price,
      image,
      stock,
      description,
    });
    // Saving to Atlas (MongoDB)
    await newMeal.save();
    // response code 200 (aka ok) with a human readable message
    return res.status(200).json({ message: "meal_created" });
  } catch (err) {
    // if anything throws, this catch runs
    console.error(err);
    // 500 = server error / fatal error
    return res.status(500).json({ error: "server_error" });
  }
}

async function modifyFood(req, res) {
  try {
    const { adminId, foodId } = req.params;
    const user = await User.findById(adminId);
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "unauthorized" });

    const { name, price, image, stock, description } = req.body;
    // Find food in the DB then updates it with the req.body
    await Food.findOneAndUpdate(
      { _id: foodId },
      {
        name: name,
        price: price,
        image: image,
        stock: stock,
        description: description,
      }
    );
    return res.status(200).json({ message: "update_successfull" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function deleteFood(req, res) {
  try {
    const { adminId, foodId } = req.params;
    const user = await User.findOne({ _id: adminId });
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "unauthorized" });
    // Tries to find the _id of the food, then deletes it
    await Food.findOneAndDelete({ _id: foodId });
    return res.status(200).json({ message: "delete_successfull" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function adminDeleteReservation(req, res) {
  try {
    const { adminId, id } = req.params;
    const user = await User.findById(adminId);
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "unauthorized" });
    // Tries to find the reservation _id, then deletes it
    await Reservation.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "delete_successfull" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
module.exports = {
  createFood,
  modifyFood,
  deleteFood,
  adminDeleteReservation,
};
