const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var OrderShema = mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    note: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Đã Giao", "Đang Giao", "Đã Hủy"],
    },
  },
  { timestamps: true }
);

OrderShema.plugin(mongoosePaginate);

module.exports = mongoose.model("order", OrderShema);
