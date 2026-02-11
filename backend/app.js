const express = require("express");
const cors = require("cors");
const userRoute = require("./app/routes/user.route");
const categoryRoute = require("./app/routes/categories.route");
const loginRoute = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/auth", loginRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend!" });
});

app.use((req, res, next) => {
  next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
