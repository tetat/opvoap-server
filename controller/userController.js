const { createToken, handleErrors } = require("../hooks/userHooks");
const Peoples = require("../models/People");
const { tokenId } = require("../hooks/commonHooks");

// create and store user in db. method: POST
module.exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const people = await Peoples.create({
      firstName,
      lastName,
      email,
      password,
    });
    const token = createToken(people._id);
    // res.cookie("jwt", token, { httpOnly: true, maxAge: process.env.TOKEN_AGE });
    // res.cookie("jwt", token, {
    //   // httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: process.env.TOKEN_AGE,
    // });
    res.status(201).json({ id: people._id, email: people.email, jwt: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
// login user. method: POST
module.exports.logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const people = await Peoples.login(email, password);
    const token = createToken(people._id);
    // res.cookie("jwt", token, {
    //   // httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: process.env.TOKEN_AGE,
    // });
    res.status(201).json({ email: people.email, jwt: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
// log out. method: GET
// module.exports.logOut = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 1 });
//     res.status(201).json({ message: "Logout Successfull" });
//   } catch (err) {
//     res.status(500).send({ error: "Server side error!" });
//   }
// };

// get all admins. method: GET
module.exports.admins = async (req, res) => {
  try {
    // _id, __v, & password is not allowed to access
    const peoples = await Peoples.find({ role: "admin" }).select({
      // _id: 0,
      __v: 0,
      password: 0,
      products: 0,
    });
    res.status(201).json(peoples);
  } catch (err) {
    res.status(500).send({ message: "Server side error!" });
  }
};

// get me with id. method: GET
module.exports.getMe = async (req, res) => {
  try {
    const id = tokenId(req.cookies.jwt);
    const people = await Peoples.findOne({ _id: id })
      .select({
        _id: 0,
        __v: 0,
        password: 0,
      })
      .populate("products", "name prices img");
    // console.log(people);
    if (people) {
      res.status(201).json(people);
    } else {
      res.status(404).json({ id: "not found!" });
    }
  } catch (err) {
    res.status(500).send({ err });
    // res.status(500).send({ message: "Server side error!" });
  }
};

module.exports.currentUser = async (req, res) => {
  // console.log("jwt: ", req.cookies.jwt);
  try {
    const id = tokenId(req.cookies.jwt);

    res.status(200).json({
      id,
      jwt: req.cookies.jwt,
    });
    // const people = await Peoples.findById({ _id: id }).select({
    //   _id: 0,
    //   __v: 0,
    //   password: 0,
    // });
    // // console.log("id: ", id);
    // if (people) {
    //   res.status(201).json(people);
    // } else {
    //   res.status(400).json({ id: "id not valid" });
    // }
  } catch (err) {
    // console.log("error: ", err);
    res.status(500).send({ err });
    // res.status(500).send({ message: "Server side error!" });
  }
};
