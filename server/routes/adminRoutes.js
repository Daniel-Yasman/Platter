const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  createFood,
  modifyFood,
  deleteFood,
  adminDeleteReservation,
  listReservationsAdmin,
} = require("../controllers/adminController");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images/meals/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/:adminId", upload.single("image"), createFood);
router.patch("/:adminId/:foodId", upload.single("image"), modifyFood);
router.delete("/foods/:adminId/:foodId", deleteFood);
router.delete("/reservations/:adminId/:id", adminDeleteReservation);
router.get("/", listReservationsAdmin);
module.exports = router;
