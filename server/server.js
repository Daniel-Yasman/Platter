const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const path = require("path");

const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: ["https://platter-8fpu.onrender.com"],
    credentials: true,
  })
);

// Use only when running locally ↓
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

// allow react to access express's ./public folder for images
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.json());

// IMPORTANT, load DB before the server. obviously.
connectDB();

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/reservation", require("./routes/reservationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// 0.0.0.0 is to avoid some container binding issues
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
