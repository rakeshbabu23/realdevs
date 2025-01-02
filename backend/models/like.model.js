const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
