const Food = require("../models/Food");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
async function createFood(req, res) {
  try {
    const { adminId } = req.params;
    const user = await User.findOne({ _id: adminId });
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "unauthorized" });
    const { name, price, image, stock, description } = req.body;
    const newMeal = new Food({
      name,
      price,
      image,
      stock,
      description,
    });
    await newMeal.save();
    return res.status(200).json({ message: "meal_created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function modifyFood(req, res) {
  try {
    const { adminId, foodId } = req.params;
    const user = await User.findOne({ _id: adminId });
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "unauthorized" });
    const { name, price, image, stock, description } = req.body;
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
    const user = await User.findOne({ _id: adminId });
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "unauthorized" });
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
