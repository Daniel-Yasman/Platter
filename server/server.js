app.use(require("cors")({
  origin: true, // reflect request Origin
  methods: ["GET","POST","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", require("cors")());

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.json());
app.use(express.static("public"));
connectDB();

app.get("/", (req, res) => {
  res.send("API running");
});

const adminRoutes = require("./routes/adminRoutes");
const foodRoutes = require("./routes/foodRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
