const express = require("express");
const router = express.Router();
const {
  createReservation,
  listUserReservations,
  userDeleteReservation,
  listAllReservations,
} = require("../controllers/reservationController");

router.post("/:userId", createReservation);
router.get("/:userId", listUserReservations);
router.delete("/:userId/:reservationId", userDeleteReservation);
router.get("/", listAllReservations);
module.exports = router;
