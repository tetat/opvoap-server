const jwt = require("jsonwebtoken");
// internal imports
const Peoples = require("../models/People");
const Products = require("../models/Product");

const tokenId = (token) => {
  let id = "";
  // console.log(token);
  if (token === undefined) return id;
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (!err) {
      id = decodedToken._id;
    }
    // console.log("Error: ", err);
    // console.log("Id: ", id);
  });
  return id;
};

const findUser = async (id) => {
  let user = {
    err: "user not found",
  };
  try {
    user = await Peoples.findOne({ _id: id }).select({
      _id: 0,
      __v: 0,
      password: 0,
      products: 0,
    });
  } catch (err) {
    user.err = "Something wrong!";
  }

  return user;
};

const findProduct = async (id) => {
  let product = {
    err: "fruit not found",
  };
  try {
    product = await Products.findOne({ _id: id }).select({
      _id: 0,
      __v: 0,
      quantity: 0,
      sold: 0,
      description: 0,
      img: 0,
    });
  } catch (err) {}

  return product;
};

module.exports = { tokenId, findUser, findProduct };
