const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  authorizeRoles,
  isAuthenticatedAdminUser,
} = require("../middlewares/adminAuthenticate");

const { isAuthenticatedUser } = require("../middlewares/authenticate");
const {
  createGroup,
  addMessageToGroup,
  addUserToGroup,
  getGroupMessages,
  getAdminGroupMessages,
  getAdminChats,
  deleteMessageToGroup,
  replyMessage,
  addUserToGroupAdmin,
  deleteGroup,
  getGroups,
  createGroupRequest,
  getGroupRequests,
  check,
  exitUserGroup,
  getReplyMessage,
  getUserDetails,
} = require("../controllers/chatController");
const {
  getChitChats,
  createChitChat,
} = require("../controllers/chitChatController");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/chat"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.route("/admin/chats").get(isAuthenticatedAdminUser, getAdminChats);

router
  .route("/admin/chats/group")
  .get(isAuthenticatedAdminUser, getAdminGroupMessages);

router
  .route("/admin/chats/create-group")
  .post(isAuthenticatedAdminUser, upload.single("groupImg"), createGroup);
router
  .route("/admin/group/requests")
  .get(isAuthenticatedAdminUser, getGroupRequests);

router
  .route("/admin/chats/delete-group/:id")
  .delete(isAuthenticatedAdminUser, deleteGroup);

router
  .route("/admin/chats/:groupId/create")
  .post(isAuthenticatedAdminUser, addMessageToGroup);
router
  .route("/admin/chats/:groupId/:add")
  .put(isAuthenticatedAdminUser, addUserToGroupAdmin);
router
  .route("/admin/chats/:groupId/delete/:id")
  .put(isAuthenticatedAdminUser, deleteMessageToGroup);

router.route("/groups").get(isAuthenticatedUser, getGroups);
router.route("/group/join").post(isAuthenticatedUser, addUserToGroup);
router.route("/group/exit").get(isAuthenticatedUser, exitUserGroup);

router.route("/group/request").post(isAuthenticatedUser, createGroupRequest);

router.route("/group/messages").get(isAuthenticatedUser, getGroupMessages);

router.route("/group/user/:id").get(isAuthenticatedUser, getUserDetails);

router
  .route("/group/message/:chatId")
  .get(isAuthenticatedUser, getReplyMessage);

router.route("/group/message/reply").put(isAuthenticatedUser, replyMessage);

// chit chat
router.route("/chit-chats").get(getChitChats);

router.route("/chit-chat/create").post(createChitChat);
module.exports = router;
