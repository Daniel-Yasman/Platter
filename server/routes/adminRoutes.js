const express = require("express");
const router = express.Router();
const {
  createFood,
  modifyFood,
  deleteFood,
  adminDeleteReservation,
} = require("../controllers/adminController");

router.post("/:adminId", createFood);
router.patch("/:adminId/:foodId", modifyFood);
router.delete("/foods/:adminId/:foodId", deleteFood);
router.delete("/reservations/:adminId/:id", adminDeleteReservation);

module.exports = router;
