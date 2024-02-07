const { default: mongoose } = require("mongoose");

const chatSchema = new mongoose.Schema({
  name: String,
  groupImg: String,
  messages: [
    {
      message: String,
      willing: {
        reply: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      status: Boolean,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("Chat", chatSchema);
module.exports = model;
