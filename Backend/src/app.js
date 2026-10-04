const express = require("express");
const cors = require("cors");

const storeRoutes = require("./routes/storeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Store Rating app is running",
  });
});

app.use("/api/stores",storeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;