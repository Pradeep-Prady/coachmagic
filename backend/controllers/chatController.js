const catchAsyncError = require("../middlewares/catchAsyncError");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const GroupRequest = require("../models/groupRequestModel");
const ErrorHandler = require("../utils/errorHandler");

//

exports.getAdminChats = catchAsyncError(async (req, res, next) => {
  const chats = await Chat.find();

  res.status(201).json({
    success: true,
    chats,
  });
});

exports.getAdminGroupMessages = catchAsyncError(async (req, res, next) => {
  const groupId = req.query.groupId;

  const group = await Chat.findOne({ _id: groupId })
    .populate("users.user", "name email userId")
    .populate("messages.willing.user", "name email userId");

  res.status(200).json({
    success: true,
    group,
  });
});

// Create a new group
exports.createGroup = catchAsyncError(async (req, res, next) => {
  let names = req.body.name;

  let newUserData = {
    name: req.body.name,
    groupImg: req.body.groupImg,
    messages: [],
  };

  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    groupImg = `${BASE_URL}/uploads/chat/${req.file.originalname}`;
    newUserData = { ...newUserData, groupImg };
  }
  const group = await Chat.findOne({ names });
  if (group) {
    return next(new ErrorHandler("Group Already Exists", 404));
  }

  const newGroup = await Chat.create(newUserData);

  res.status(201).json({
    success: true,
    group: newGroup,
  });
});

exports.updateGroup = catchAsyncError(async (req, res, next) => {
  
  let newUserData = {
    id: req.body.id,
    name: req.body.name,
    groupImg: req.body.groupImg,
  };

  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  let groupImg;

  if (req.file) {
    groupImg = `${BASE_URL}/uploads/chat/${req.file.originalname}`;
    newUserData = { ...newUserData, groupImg };
  }

  const group = await Chat.findByIdAndUpdate();
  if (group) {
    return next(new ErrorHandler("Group Already Exists", 404));
  }

  const newGroup = await Chat.create(newUserData);

  res.status(201).json({
    success: true,
    group: newGroup,
  });

});

exports.deleteGroup = catchAsyncError(async (req, res, next) => {
  const group = await Chat.findById(req.params.id);

  if (!group) {
    return next(new ErrorHandler("Group not found", 404));
  }
  await Chat.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});

exports.addUserToGroupAdmin = catchAsyncError(async (req, res, next) => {
  const groupId = req.params.groupId;
  const userId = req.params.add;

  const group = await Chat.findOne({ _id: groupId });
  if (!group) {
    return next(new ErrorHandler("Group Already Exists", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  if (group.users.some((user) => user.user.toString() === userId)) {
    return next(new ErrorHandler("User is already in the group", 400));
  }

  group.users.push({ user: userId });

  await group.save();

  user.chatGroup = group._id;

  await user.save();

  res.status(201).json({
    success: true,
    group,
  });
});

exports.addMessageToGroup = catchAsyncError(async (req, res, next) => {
  const groupId = req.params.groupId;
  const { message } = req.body;

  const group = await Chat.findById(groupId);

  if (!group) {
    return next(new ErrorHandler("Group Not Found", 404));
  }

  group.messages.push({ message });
  await group.save();

  res.status(201).json({
    success: true,
    group,
  });
});

exports.deleteMessageToGroup = catchAsyncError(async (req, res, next) => {
  const groupId = req.params.groupId;
  const messageId = req.params.id;

  const group = await Chat.findById(groupId);

  if (!group) {
    return next(new ErrorHandler("Group Not Found", 404));
  }

  group.messages = group.messages.filter(
    (message) => message._id.toString() !== messageId
  );

  await group.save();

  res.status(201).json({
    success: true,
    group,
    messages: group.messages,
  });
});

exports.addUserToGroup = catchAsyncError(async (req, res, next) => {
  const { groupName } = req.body;

  const userIdToAdd = req.user.id;

  const group = await Chat.findOne({ name: groupName });

  if (!group) {
    return next(new ErrorHandler("Group Not Found", 404));
  }

  const user = await User.findById(userIdToAdd);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  if (group.users.some((user) => user.user.toString() === userIdToAdd)) {
    return next(new ErrorHandler("User is already in the group", 400));
  }

  group.users.push({ user: userIdToAdd });

  await group.save();

  user.chatGroup = group._id;

  await user.save();

  res.status(201).json({
    success: true,
    group,
    user,
  });
});

exports.exitUserGroup = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  if (user.chatGroup) {
    const group = await Chat.findById(user.chatGroup);

    if (group.users.some((groupUser) => groupUser.user.toString() === userId)) {
      group.users.remove({ user: userId });

      await group.save();

      user.chatGroup = undefined;

      await user.save();
    } else {
      return next(new ErrorHandler("User is not in the group", 400));
    }
  }

  res.status(201).json({
    success: true,
    user,
  });
});

exports.getGroups = catchAsyncError(async (req, res, next) => {
  const groups = await Chat.find();

  if (!groups) {
    return next(new ErrorHandler("Groups not found", 404));
  }
  res.status(200).json({
    success: true,
    groups,
  });
});

exports.getGroupMessages = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  if (!user.chatGroup) {
    return next(new ErrorHandler("User is not part of any chat group", 404));
  }

  const chatGroup = await Chat.findById(user.chatGroup).populate(
    "users.user",
    "name email userId domain avatar"
  );

  if (!chatGroup) {
    return next(new ErrorHandler("Chat group not found", 404));
  }

  res.status(200).json({
    success: true,
    chats: chatGroup,
    name: chatGroup.name,
    messages: chatGroup.messages,
  });
});

exports.getReplyMessage = catchAsyncError(async (req, res, next) => {
  const { chatId } = req.params;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const group = await Chat.findOne(user.chatGroup);

  if (!group) {
    return next(new ErrorHandler("Group Not Found", 404));
  }

  const messageToUpdate = group.messages.find(
    (message) => message._id.toString() === chatId
  );

  if (!messageToUpdate) {
    return next(new ErrorHandler("Message Not Found", 404));
  }

  const existingReaction = messageToUpdate.willing;

  if (existingReaction?.user) {
    return next(new ErrorHandler("Message already marked as willing", 400));
  }

  res.status(200).json({
    success: true,
    messageToUpdate,
  });
});

exports.replyMessage = catchAsyncError(async (req, res, next) => {
  const { messageId, status, reply } = req.body;
  const userId = req.user._id;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const group = await Chat.findById(user.chatGroup);

  if (!group) {
    return next(new ErrorHandler("Group Not Found", 404));
  }

  const messageToUpdate = group.messages.find(
    (message) => message._id.toString() === messageId
  );

  if (!messageToUpdate) {
    return next(new ErrorHandler("Message Not Found", 404));
  }

  const existingReaction = messageToUpdate.willing;

  if (existingReaction?.user) {
    return next(new ErrorHandler("Message already marked as willing", 400));
  }

  if (status) {
    messageToUpdate.willing = { user: userId, reply: reply };
  } else {
    // Handle the "not willing" logic here
  }

  await group.save();

  res.status(200).json({
    success: true,
  });
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById({ _id: id });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.createGroupRequest = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  const request = await GroupRequest.create({ name: name, user: userId });

  res.status(200).json({
    success: true,
    request,
  });
});

exports.getGroupRequests = catchAsyncError(async (req, res, next) => {
  const requests = await GroupRequest.find().populate(
    "user",
    "name email userId"
  );

  res.status(200).json({
    success: true,
    requests,
  });
});
