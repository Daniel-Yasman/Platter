const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const path = require("path");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: ["http://localhost:8080", "https://platter-mu.vercel.app"],
    credentials: true,
  })
);

// const CORS_OPTS = {
//   origin: "https://platter-mu.vercel.app",
//   credentials: true,
// };

// app.use(cors(CORS_OPTS));
// app.options(/.*/, cors(CORS_OPTS));

app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.json());

connectDB();

app.get("/", (_req, res) => res.send("API running"));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/reservation", require("./routes/reservationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/inquiry", require("./routes/inquiryRoutes"));
app.use("/api/subscriber", require("./routes/subscriberRoutes"));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
