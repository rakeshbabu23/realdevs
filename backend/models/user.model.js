const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  portfolioUpdateCount: {
    type: Number,
    default: 0,
  },
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword; // Set the hashed password
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password); // Compare input password with stored hashed password
};

module.exports = mongoose.model("User", userSchema);
