const mongoose = require("mongoose");

const RefreshToken = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RefreshToken", RefreshToken);
