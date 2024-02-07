const mongoose = require("mongoose");

const groupRequestSchema = new mongoose.Schema({
  name: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const model = mongoose.model("GroupRequest", groupRequestSchema);
module.exports = model;
