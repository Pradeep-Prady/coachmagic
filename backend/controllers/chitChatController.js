const catchAsyncError = require("../middlewares/catchAsyncError");
const ChitChat = require("../models/chitChatModel");

exports.createChitChat = catchAsyncError(async (req, res, next) => {
  const { name, email, date, from, to } = req.body;
  const chitchat = await ChitChat.create({
    name,
    email,
    date,
    from,
    to,
  });

  res.status(201).json({
    success: true,
    chitchat,
  });
});

exports.getChitChats = catchAsyncError(async (req, res, next) => {
  const chitchats = await ChitChat.find();

  res.status(201).json({
    success: true,
    chitchats,
  });
});
