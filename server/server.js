const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const bankRoutes = require("./routes/bankRoutes");

const app = express();

// =========================
// CORS
// =========================
app.use(
  cors({
    origin: [
      "https://banking-system-9gcrhyv13-csevaibhav2000-7545s-projects.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =========================
// Middleware
// =========================
app.use(express.json());

// =========================
// Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);

// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
  res.send("Banking Backend Running");
});

// =========================
// Database
// =========================
connectDB();

// =========================
// Server
// =========================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});