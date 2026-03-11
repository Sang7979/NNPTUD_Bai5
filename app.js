const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();


// ===== VIEW ENGINE =====
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// ===== MIDDLEWARE =====
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// ===== ROUTES =====
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/roles", require("./routes/roles"));
app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/categories", require("./routes/categories"));


// ===== DATABASE CONNECTION =====
mongoose
  .connect("mongodb://127.0.0.1:27017/NNPTUD_BAI5")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});


// ===== 404 HANDLER =====
app.use((req, res, next) => {
  next(createError(404));
});


// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;