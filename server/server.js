const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const bankRoutes = require("./routes/bankRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);

app.get("/", (req, res) => {
  res.send("Banking Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server Started on Port ${process.env.PORT}`
  );
});