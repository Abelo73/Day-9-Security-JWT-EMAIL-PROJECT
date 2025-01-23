const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/students", studentRoutes);

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
