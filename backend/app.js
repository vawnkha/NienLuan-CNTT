const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoute = require("./app/routes/user.route");
const wishlistRoute = require("./app/routes/wishlist.route");
const categoryRoute = require("./app/routes/categories.route");
const productRoute = require("./app/routes/products.route");
const reviewRoute = require("./app/routes/reviews.route");
const addressRoute = require("./app/routes/addresses.route");
const cartRoute = require("./app/routes/carts.route");
const orderRoute = require("./app/routes/orders.route");
const paymentRoute = require("./app/routes/payments.route");
const contactRoute = require("./app/routes/contacts.route");
const loginRoute = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/users", userRoute);
app.use("/api/wishlists", wishlistRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/addresses", addressRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/contacts", contactRoute);
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
