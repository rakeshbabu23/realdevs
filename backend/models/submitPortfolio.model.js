const mongoose = require("mongoose");

const submitPortfolioSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    url: {
      type: "String",
      required: true,
    },
    image: [String],
  },
  {
    timestamps: true,
  }
);

const SubmitPortfolio = mongoose.model(
  "SubmitPortfolio",
  submitPortfolioSchema
);

module.exports = SubmitPortfolio;
