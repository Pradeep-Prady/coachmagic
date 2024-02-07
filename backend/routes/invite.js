const express = require("express");

const {
  isAuthenticatedUser,
  authorizeRoles,
  isGoogleAuthenticatedUser,
} = require("../middlewares/authenticate");
const {
  getUsers,
  createInvite,
  updateGetInvite,
  getInvites,
  sendInvites,
  getSingleUser,
  getInvite,
  getLastInvite,
  clearSendInvites,
  clearGetInvites,
  getInvitesForDash,
  getGoogle,
  getGoogleRedirect,
  scheduleEvent,
  sendFeedback,
} = require("../controllers/inviteController");

const router = express.Router();

router.route("/users").get(isAuthenticatedUser, getUsers);
router.route("/user/:id").get(isAuthenticatedUser, getSingleUser);
router.route("/create-invite").post(isAuthenticatedUser, createInvite);

router.route("/get-myinvites").get(isAuthenticatedUser, getInvites);
router.route("/get-invites").get(isAuthenticatedUser, getInvitesForDash);
router.route("/get-invite/:id").get(isAuthenticatedUser, getInvite);
router.route("/get-last-invite").get(isAuthenticatedUser, getLastInvite);

router.route("/invite/:id/feedback").put(isAuthenticatedUser, sendFeedback);


router.route("/update-invite").put(isAuthenticatedUser, updateGetInvite);

router.route("/send-invites").get(isAuthenticatedUser, sendInvites);
router.route("/send-invites/clear").post(isAuthenticatedUser, clearSendInvites);
router.route("/get-invites/clear").post(isAuthenticatedUser, clearGetInvites);

router.route("/google").get(getGoogle);
router.route("/google/redirect").post(isAuthenticatedUser, getGoogleRedirect);
router.route("/schedule-event").post(isAuthenticatedUser, scheduleEvent);

module.exports = router;
