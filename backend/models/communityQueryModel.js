const mongoose = require("mongoose");

const communityQuerySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  domain: {
    type: String,
  },
  servicename: {
    type: String,
  },
  question: {
    type: String,
  },
  qussituation: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  statusofquery: {
    type: String,
    default: "In Progress",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let Schema = mongoose.model("CommunityQuery", communityQuerySchema);

module.exports = Schema;
