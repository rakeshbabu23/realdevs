const mongoose = require("mongoose");

const createGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", createGroupSchema);

module.exports = Group;
