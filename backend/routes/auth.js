const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  loginUser,
  getUserProfile,
  updateProfile,
  updateSkills,
  updateSchedule,
  updatePricing,
  logoutUser,
  forgotPassword,
  resetPassword,
  checkUserId,
  updateSchool,
  updateSchoolActive,
  updateCommunity,
  updateCommunityActive,
} = require("../controllers/userController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const {
  verifyUser,
  insertUser,
} = require("../controllers/verifyUserController");
const { google } = require("googleapis");
const {
  getGoogle,
  getGoogleRedirect,
  scheduleEvent,
} = require("../controllers/inviteController");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.route("/verify").post(verifyUser);
router.route("/signin/:token").get(insertUser);

router.route("/check-userid").post(checkUserId);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);

router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router
  .route("/update/profile")
  .put(isAuthenticatedUser, upload.single("avatar"), updateProfile);
router.route("/update/skills").put(isAuthenticatedUser, updateSkills);
router.route("/update/schedule").put(isAuthenticatedUser, updateSchedule);
router.route("/update/price").put(isAuthenticatedUser, updatePricing);

router.route("/update/college").put(isAuthenticatedUser, updateCommunity);
router.route("/update/school").put(isAuthenticatedUser, updateSchool);
router
  .route("/update/college/active")
  .put(isAuthenticatedUser, updateCommunityActive);
router
  .route("/update/school/active")
  .put(isAuthenticatedUser, updateSchoolActive);

module.exports = router;
