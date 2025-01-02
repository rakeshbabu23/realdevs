const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    image: [String],
    url: String,
    enableComments: { type: Boolean, default: true },
    views: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
