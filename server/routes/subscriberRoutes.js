const express = require("express");
const router = express.Router();

const {
  newSubscriber,
  listSubscribers,
} = require("../controllers/subscriberController");

router.post("/", newSubscriber);
router.get("/", listSubscribers);

module.exports = router;
