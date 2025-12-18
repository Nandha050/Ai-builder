const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;
