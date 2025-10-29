const express = require("express");
const router = express.Router();
const { listFoods } = require("../controllers/foodController");

router.get("/", listFoods);

module.exports = router;
