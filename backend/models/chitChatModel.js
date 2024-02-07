const mongoose = require("mongoose");

const chitchatSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  from: String,
  to: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("ChitChat", chitchatSchema);
module.exports = model;