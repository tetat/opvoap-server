const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
// internal imports
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

const port = process.env.PORT || 5000;
const app = express();
dotenv.config();

// middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

// database connection //
// const localURL = "mongodb://localhost:27017/opvap";

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server running!");
});

app.use(userRouter);
app.use(productRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Requested url not found!" });
});
// errors
app.use((err, req, res, next) => {
  // console.log(err.message);
  if (err.message) {
    // console.log(err.message);
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).send("There was an error!");
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
