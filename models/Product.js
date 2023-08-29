const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter fruit name"],
      trim: true,
      minlength: [3, "Min len of name must be 3 characters long"],
    },
    prices: {
      type: Map,
      of: String,
      default: {},
    },
    img: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Please provide image url"],
    },
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: "peoples",
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("products", productSchema);

module.exports = Products;
