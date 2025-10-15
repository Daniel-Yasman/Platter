const express = require("express");
const router = express.Router();
const {
  createReservation,
  userDeleteReservation,
  listReservations,
} = require("../controllers/reservationController");

router.post("/:userId", createReservation);
router.delete("/:userId/:reservationId", userDeleteReservation);
router.get("/:userId", listReservations);

module.exports = router;
