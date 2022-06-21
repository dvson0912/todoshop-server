const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  text: {
    type: String,
  },
  imgContent: {
    type: String,
  },
  imgAvatar: {
    type: String,
  },
  heading: {
    type: String,
  },
});
