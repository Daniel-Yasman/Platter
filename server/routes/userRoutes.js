const express = require("express");
const router = express.Router();
const {
  register,
  login,
  addToCart,
  getUser,
  updateCartItem,
  removeCartItem,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.post("/:userId", addToCart);
router.get("/:userId", getUser);
router.patch("/:userId", updateCartItem);
router.delete("/:userId/:foodId", removeCartItem);
module.exports = router;
