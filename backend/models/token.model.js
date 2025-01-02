const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    // type: {
    //   type: String,
    //   enum: [
    //     tokenTypes.REFRESH,
    //     tokenTypes.RESET_PASSWORD,
    //     tokenTypes.VERIFY_EMAIL,
    //   ],
    //   required: true,
    // },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
