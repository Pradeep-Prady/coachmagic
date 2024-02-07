const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter passsword"],
    maxlength: [8, "password cannot exceed 8 characters"],
    select: false,
  },
  phone: {
    type: String,
  },
  position: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
  },
});

adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

adminUserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

adminUserSchema.methods.isValidPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const model = mongoose.model("AdminUser", adminUserSchema);
module.exports = model;
