const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enique: true,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);
categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("category", categorySchema);
