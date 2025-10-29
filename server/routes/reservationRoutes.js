const express = require("express");
const router = express.Router();
const {
  createReservation,
  userDeleteReservation,
  listAllReservations,
} = require("../controllers/reservationController");

router.post("/:userId", createReservation);
router.delete("/:userId/:reservationId", userDeleteReservation);
router.get("/", listAllReservations);

module.exports = router;
