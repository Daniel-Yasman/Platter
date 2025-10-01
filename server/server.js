const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// CORS FIRST
app.use(
  cors({
    origin: [/^https?:\/\/.*\.vercel\.app$/, "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.options("*", cors());

// Static + JSON
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.json());
app.use(express.static("public"));

connectDB();

app.get("/", (req, res) => res.send("API running"));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/reservation", require("./routes/reservationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
