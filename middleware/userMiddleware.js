const Peoples = require("../models/People");
const { tokenId, findProduct } = require("../hooks/commonHooks");

const isAdmin = async (req, res, next) => {
  // const token = req.cookies.jwt;
  try {
    const people = await Peoples.findOne({ _id: tokenId(req.cookies.jwt) });
    // console.log(people.role, tokenId(req.cookies.jwt));
    if (people.role === "admin") next();
    else {
      const error = new Error("Not allowed!");
      next(error);
    }
  } catch (err) {
    const error = new Error("Not allowed!");
    next(error);
  }
};

const isUser = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const result = tokenId(token);
    // console.log("token: ", req.cookies);
    if (result === "") {
      const err = new Error("Please login");
      next(err);
    } else next();
  } catch (err) {
    const error = new Error("Please login");
    next(error);
  }
};

const isMe = (req, res, next) => {
  const requestedId = req.params.id;
  const token = req.cookies.jwt;
  let delUp = false;
  // tokenId will give current user's id
  if (requestedId === tokenId(token)) {
    delUp = true;
  }
  if (delUp) next();
  else {
    const err = new Error("Not allowed!");
    next(err);
  }
};

const isMyProduct = (req, res, next) => {
  // const requestedId = req.params.id;
  const product = findProduct(tokenId(req.cookies.jwt));
  // console.log(req.body);
  console.log(tokenId(req.cookies.jwt));
  if (product.supplier === tokenId(req.cookies.jwt)) next();
  else {
    const err = new Error("Not allowed!");
    next(err);
  }
};

module.exports = { isUser, isMe, isAdmin, isMyProduct };
