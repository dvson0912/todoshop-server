const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderDetailsSchema = mongoose.Schema(
  {
    idOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    nameProduct: {
      type: String,
    },
    size: {
      type: String,
    },
    avatar: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);
OrderDetailsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("orderDetails", OrderDetailsSchema);
