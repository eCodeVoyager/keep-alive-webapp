//  src/ modules / users / models / userModel.mongoose.js

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

//Plugins
userSchema.plugin(mongoosePaginate);

//Methods

// Check if the password is valid
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// password hashing before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.changePassword = async function (oldPassword, newPassword) {
  const isValid = await this.isPasswordMatch(oldPassword);
  if (isValid === false) {
    return false;
  }
  this.password = newPassword;
  await this.save();
  return true;
};

module.exports = mongoose.model("User", userSchema);
