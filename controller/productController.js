const { tokenId } = require("../hooks/commonHooks");
const { handleErrors } = require("../hooks/userHooks");
const Products = require("../models/Product");
const Peoples = require("../models/People");

// create and store fruit in db. method: POST
module.exports.addProduct = async (req, res) => {
  const { name, prices, img } = req.body;
  const supplier = tokenId(req.cookies.jwt);
  console.log(supplier);
  try {
    const product = await Products.create({
      name,
      prices,
      img,
      supplier,
    });
    // console.log(fruit.prices.get("Dhaka"));

    const result = await Peoples.updateOne(
      { _id: supplier },
      { $push: { products: product._id } }
    );
    // console.log("result", result);
    res.status(201).json({ productId: product._id, updated: result });
  } catch (err) {
    // console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
// get all products. method: GET
module.exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find({})
      .select({
        __v: 0,
      })
      .populate("supplier", "firstName lastName email -_id");
    res.status(201).json({ products });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
// get a product. method: GET
module.exports.getProduct = async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.params.id })
      .select({
        __v: 0,
      })
      .populate("supplier", "firstName lastName email -_id");
    res.status(201).json({ product });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
// update a product. method: PATCH
module.exports.updateProduct = async (req, res) => {
  try {
    if (req.body) {
      const updates = req.body;
      // console.log(updates);
      if (updates._id || updates.name || updates.img || updates.supplier) {
        res.status(403).json({
          error: "updating id, name, image, & supplier is not allowed!",
        });
      } else {
        const product = await Products.findOne({ _id: req.params.id }).select({
          _id: 0,
          __v: 0,
          name: 0,
          img: 0,
          supplier: 0,
          createdAt: 0,
          updatedAt: 0,
        });
        const Keys = Object.keys(updates.prices);
        Keys.map((Key) => {
          product.prices.set(Key, updates.prices[Key]);
        });
        updates.prices = product.prices;
        // console.log(Keys, fruit.prices);
        const result = await Products.updateOne(
          { _id: req.params.id },
          { $set: updates }
        );
        // console.log(result);
        res.status(201).json({ result });
      }
    } else {
      res.status(400).json({ message: "Please provide data to update!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Server side error!" });
  }
};
// delete a product from db. method: DELETE
module.exports.deleteProduct = async (req, res) => {
  // console.log("ok");
  try {
    const productId = req.params.id;
    const userId = tokenId(req.cookies.jwt);
    // console.log("user id: ", userId, "fruit id: ", productId);
    const product = await Products.findOne({ _id: productId });
    const user = await Peoples.findOne({ _id: userId }).select({
      _id: 0,
      __v: 0,
      password: 0,
    });
    // console.log("Supplier: ", String(fruit.supplier));
    if (String(product.supplier) === userId) {
      const result = await Products.deleteOne({ _id: req.params.id });
      user.products = user.products.filter(
        (product) => String(product) !== String(productId)
      );
      const result1 = await Peoples.updateOne({ _id: userId }, { $set: user });
      // console.log(result);
      res.status(201).json({ result, result1 });
    } else {
      res.status(500).json({ error: "Not allowed!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server side error!" });
  }
};
