const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const passwordValidator = (value) => {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
  return passwordRegex.test(value);
};

const verifyUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  userId: {
    type: String,
    required: [true, "Please enter User ID"],
    validate: {
      validator: (userId) => /^[a-z0-9_.-]+$/.test(userId),
      message:
        "User ID must contain only lowercase letters, numbers, _, ., and -",
    },
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    validate: {
      validator: passwordValidator,
      message:
        "Password must be 8 to 12 characters with at least one number and one special character (!@#$%^&*)",
    },
  },

  token: {
    type: String,
    required: true,
  },
});

const model = mongoose.model("VerifyUser", verifyUserSchema);
module.exports = model;
