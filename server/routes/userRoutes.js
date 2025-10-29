const express = require("express");
const router = express.Router();
const {
  register,
  login,
  addToCart,
  getUser,
  updateCartItem,
  removeCartItem,
  resetCart,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.post("/:userId", addToCart);
router.get("/:userId", getUser);
router.patch("/:userId", updateCartItem);
router.delete("/:userId/:foodId", removeCartItem);
router.patch("/:userId/cartReset", resetCart);
module.exports = router;
