// require("dotenv").config();
const jwt = require("jsonwebtoken");

// create token
const createToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_AGE,
  });
};

const handleErrors = (err) => {
  const errors = {};
  // console.log(err);

  // login errors section //
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // signup errors section //
  // duplicate errors
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("peoples validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  // products validation errors
  if (err.message.includes("products validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties?.path] = properties?.message;
    });
  }

  return errors;
};

module.exports = {
  handleErrors,
  createToken,
};
