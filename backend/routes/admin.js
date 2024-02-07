const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  authorizeRoles,
  isAuthenticatedAdminUser,
} = require("../middlewares/adminAuthenticate");
const {
  registerAdminUser,
  loginAdminUser,
  getAdminUsers,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getAdminUserProfile,
} = require("../controllers/adminUserController");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/admin"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
``
router
  .route("/admin/register")
  .post(isAuthenticatedAdminUser, authorizeRoles("Admin"), registerAdminUser);
router.route("/admin/login").post(loginAdminUser);
router
  .route("/admin/profile")
  .get(isAuthenticatedAdminUser, getAdminUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedAdminUser, authorizeRoles("Admin"), getAdminUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedAdminUser, authorizeRoles("Admin"), getAdminUser)
  .put(isAuthenticatedAdminUser, authorizeRoles("Admin"), updateAdminUser)
  .delete(isAuthenticatedAdminUser, authorizeRoles("Admin"), deleteAdminUser);

module.exports = router;
