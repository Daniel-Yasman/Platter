const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const allow = [/^https?:\/\/.*\.vercel\.app$/, "http://localhost:5173"];

// CORS first
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      const ok = allow.some((r) =>
        typeof r === "string" ? r === origin : r.test(origin)
      );
      cb(ok ? null : new Error("Not allowed by CORS"), ok);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Static + JSON
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.json());
app.use(express.static("public"));

connectDB();

app.get("/", (_req, res) => res.send("API running"));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/reservation", require("./routes/reservationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
