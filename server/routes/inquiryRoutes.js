const express = require("express");
const router = express.Router();
const {
  submitInquiry,
  listInqueries,
} = require("../controllers/inquiryController");

router.post("/", submitInquiry);
router.get("/", listInqueries);

module.exports = router;
