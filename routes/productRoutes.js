const express = require("express");
// internal imports
const productController = require("../controller/productController");
const { isUser, isAdmin, isMyFruit } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/addproduct", productController.addProduct);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProduct);
router.patch("/updateproduct/:id", isAdmin, productController.updateProduct);
router.delete("/deleteproduct/:id", isAdmin, productController.deleteProduct);

module.exports = router;
