const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    replyText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
