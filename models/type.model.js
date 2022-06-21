const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const typeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enique: true,
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
  },
  { timestamps: true }
);

typeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("type", typeSchema);
