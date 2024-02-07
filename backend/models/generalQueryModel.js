const mongoose = require("mongoose");

const generalQuerySchema = new mongoose.Schema({
  feedbacktype: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  fakeAccountName: {
    type: String,
  },
  reason: {
    type: String,
    required: [true, "Please Enter Reason"],
  },
  proof: {
    type: String,
  },
  // user: {
  //   type: mongoose.Schema.types.ObjectId,
  //   ref: User,
  // },
  statusoffeedback: {
    type: String,
    default: "In Progress",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let Schema = mongoose.model("GeneralQuery", generalQuerySchema);

module.exports = Schema;
