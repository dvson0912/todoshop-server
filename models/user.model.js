const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const UserModel = mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
      minHeight: 6,
    },
    password: {
      type: String,
      required: true,
      minHeight: 6,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserModel.plugin(paginate);

module.exports = mongoose.model("user", UserModel);
