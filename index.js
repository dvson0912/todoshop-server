require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const productRoute = require("./routes/product.route");
const categoryRoute = require("./routes/category.route");
const typeRoute = require("./routes/type.route");
const authRoute = require("./routes/auth.route");
const orderRoute = require("./routes/order.route");

const app = express();
const post = process.env.PORT || 5000;

const connectDB = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@todoshop.9mwrp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("connect");
    })
    .catch((err) => {
      console.log(err);
    });
};

connectDB();

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://lovely-lokum-279835.netlify.app",
    // origin:"http://localhost:3000".
    credentials: true,
  })
);
app.use(express.static(__dirname + "/public"));

app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/type", typeRoute);
app.use("/auth", authRoute);
app.use("/order", orderRoute);

app.listen(post, () => console.log(`Server is running on post ${post}`));
