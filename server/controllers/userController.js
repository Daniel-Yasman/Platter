const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const MAX_QTY = 10;
const MIN_QTY = 1;
/*
Email conditions:
• One or more charecters before @
• @ must be included
• charecters after the @
• dot must be included after the charecters
• anything after the dot
result: something@domain.whatever
*/
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/*
Phone conditions:
• starts at 05
• 10 digits total
*/
const phoneIL = /^05\d{8}$/;

function isValidEmail(s) {
  // is a string + emailRe returns true
  return typeof s === "string" && emailRe.test(s);
}

function isValidPassword(s) {
  // is a string OR less than 8? bad
  if (typeof s !== "string" || s.length < 8) return false;
  // must have charecters + numbers
  return /[a-zA-Z]/.test(s) && /[0-9]/.test(s);
}

function isValidIsraeliPhone(s) {
  // must be string + valid Israeli phone
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

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hash,
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

    const user = await User.findOne({ email }).select("_id role password");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(409).json({ error: "invalid_password" });
    if (!user) return res.status(404).json({ error: "not_found" });
    return res.status(200).json({
      message: "login_successfull",
      data: { userId: user._id, role: user.role },
    });
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
    // Iterate through the whole users cart and try to find the foodId
    const found = user.cart.find((i) => i.foodId.toString() === foodId);
    if (found) {
      // making sure quantity is < MAX_QTY to never had -1 Apples in stock for example
      if (found.quantity + qty > MAX_QTY)
        return res.status(403).json({ error: "limit_reached" });
      found.quantity += qty;
    } else {
      // if the food wasn't found, simply push it into the users cart
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
    /*
    find user by id + include the name of the user, the cart of the user
    and the cart's foodId's and the name, price, and image of the carts foods.
    */
    const user = await User.findById(userId)
      .select("name cart")
      .populate("cart.foodId", "_id name price image");

    if (!user) return res.status(404).json({ error: "not_found" });

    // clean the cart so that there are no foodId's with null or undefined
    const items = (user.cart || []).filter(
      (i) => i && i.foodId && i.foodId._id
    );

    // Simple total calculator
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
    // $pull = remove but a specific field
    const result = await User.updateOne(
      {
        _id: userId,
        "cart.foodId": foodId,
      },
      { $pull: { cart: { foodId } } }
    );

    // 404's if no items were removed
    if (result.modifiedCount === 0)
      return res.status(404).json({ error: "not_found" });

    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
}

async function resetCart(req, res) {
  const { userId } = req.params;
  if (!userId) return res.status(404).json({ error: "no_userId" });
  try {
    // sets user cart to an empty arr
    await User.updateOne({ _id: userId }, { $set: { cart: [] } });
    // fetches the users cart
    const user = await User.findById(userId).select("cart");
    // returns the updated cart
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
