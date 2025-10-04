const User = require("../models/User");
const Food = require("../models/Food");

const MAX_QTY = 10;
const MIN_QTY = 1;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneIL = /^05\d{8}$/;
function isValidEmail(s) {
  return typeof s === "string" && emailRe.test(s);
}

function isValidPassword(s) {
  if (typeof s !== "string" || s.length < 8) return false;
  return /[a-zA-Z]/.test(s) && /[0-9]/.test(s);
}

function isValidIsraeliPhone(s) {
  return typeof s === "string" && phoneIL.test(s);
}

async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    if (
      !isValidEmail(email) ||
      !isValidPassword(password) ||
      !isValidIsraeliPhone(phone)
    )
      return res.status(400).json({ error: "invalid_input" });
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      phone: phone,
    });
    await newUser.save();
    return res.status(200).json({ message: "user_created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "missing_fields" });
    const emailExists = await User.findOne({ email });
    if (!emailExists) return res.status(401).json({ error: "does_not_exist" });
    const user = await User.findOne({ email: email }, { _id: 1 });
    const userId = user._id.toString();
    return res
      .status(200)
      .json({ message: "login_successfull", data: { userId: userId } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function addToCart(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(409).json({ error: "conflict" });
    const { foodId, quantity } = req.body;

    if (!foodId || quantity == null)
      return res.status(400).json({
        error: "missing_fields",
      });
    const qty = Number(quantity);
    if (qty < MIN_QTY)
      return res.status(400).json({ error: "minimum_reached" });
    if (qty > MAX_QTY)
      return res.status(400).json({ error: "maximum_reached" });
    // try and find if the foodId exists in the cart. ↓↓↓
    const found = user.cart.find((i) => i.foodId.toString() === foodId);
    if (found) {
      if (found.quantity + qty > MAX_QTY)
        return res.status(403).json({ error: "limit_reached" });
      found.quantity += qty;
    } else {
      user.cart.push({ foodId, quantity: qty });
    }
    await user.save();
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("name cart")
      .populate("cart.foodId", "_id name price image");

    if (!user) return res.status(404).json({ error: "not_found" });

    // keep only items in the cart whose foodId is !NOT! null / undefined
    const items = (user.cart || []).filter(
      (i) => i && i.foodId && i.foodId._id
    );

    let total = 0;
    for (let idx = 0; idx < items.length; idx++) {
      const i = items[idx];
      let price = 0;
      if (typeof i.foodId.price === "number") {
        price = i.foodId.price;
      }
      total = total + i.quantity * price;
    }

    return res.status(200).json({ name: user.name, cart: items, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

async function updateCartItem(req, res) {
  const { userId } = req.params;
  const { foodId, quantity } = req.body;
  if (!foodId || quantity == null)
    return res.status(400).json({
      error: "missing_fields",
    });

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < MIN_QTY)
    return res.status(400).json({ error: "invalid_input" });

  try {
    if (qty > MAX_QTY) return res.status(400).json({ error: "limit_reached" });

    // find user & foodId in cart, set the user's cart quantity to qty
    const result = await User.updateOne(
      { _id: userId, "cart.foodId": foodId },
      { $set: { "cart.$.quantity": qty } }
    );

    // user's cart has no entry for the foodId.
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "not_found" });

    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}
async function removeCartItem(req, res) {
  const { userId, foodId } = req.params;

  if (!foodId)
    return res.status(400).json({
      error: "missing_fields",
    });
  try {
    const result = await User.updateOne(
      {
        _id: userId,
        "cart.foodId": foodId,
      },
      { $pull: { cart: { foodId } } }
    );

    if (result.modifiedCount === 0)
      return res.status(404).json({ error: "not_found" });

    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

async function resetCart(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(404).json({ error: "no_userId" });
  try {
    await User.updateOne({ _id: userId }, { $set: { cart: [] } });
    const user = await User.findById(userId).select("cart");
    return res.status(200).json({ message: "cart_cleared", cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

module.exports = {
  register,
  login,
  addToCart,
  getUser,
  updateCartItem,
  removeCartItem,
  resetCart,
};
