const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const ProductModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    size: {
      type: Array,
    },
    color: {
      type: Array,
    },
    descriptionImg: {
      type: Array,
    },
    link: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    nameCategory: {
      type: String,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "type",
    },
    nameType: {
      type: String,
    },
  },
  { timestamps: true }
);
ProductModel.plugin(mongoosePaginate);
module.exports = mongoose.model("products", ProductModel);
