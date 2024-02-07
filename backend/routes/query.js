const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  newGeneralQuery,
  updateSingleGeneralQuery,
  getSingleGeneralQuery,
  getGeneralQueries,
  newCommunityQuery,
  getCommunityQueries,
  getSingleCommunityQuery,
  updateSingleCommunityQuery,
  deleteCommunityQuery,
  deleteGeneralQuery,
  addtieup,
  viewtieup,
  edittieup,
  deletetieup,
  getTieUps,
  getUserTieUps,
} = require("../controllers/queryController");

const {
  isAuthenticatedAdminUser,
  authorizeRoles,
} = require("../middlewares/adminAuthenticate");
const { isAuthenticatedUser } = require("../middlewares/authenticate");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/query"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const uploadData = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/data"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.route("/general-query").post(upload.single("proof"), newGeneralQuery);

router.route("/community-query").post(newCommunityQuery);

router
  .route("/admin/general-query")
  .get(isAuthenticatedAdminUser, getGeneralQueries);
router.route("/admin/community-query").get(getCommunityQueries);

router
  .route("/admin/general-query/:id")
  .get(isAuthenticatedAdminUser, getSingleGeneralQuery)
  .put(isAuthenticatedAdminUser, updateSingleGeneralQuery)
  .delete(isAuthenticatedAdminUser, deleteGeneralQuery);

router
  .route("/admin/community-query/:id")
  .get(isAuthenticatedAdminUser, getSingleCommunityQuery)
  .put(isAuthenticatedAdminUser, updateSingleCommunityQuery)
  .delete(isAuthenticatedAdminUser, deleteCommunityQuery);

router.route("/admin/tieups").get(getTieUps);
router
  .route("/admin/tieup")
  .post(isAuthenticatedAdminUser, uploadData.single("file"), addtieup);
router.route("/admin/tieup/:id").get(isAuthenticatedAdminUser, viewtieup);
router
  .route("/admin/tieup/:id/edit")
  .put(isAuthenticatedAdminUser, uploadData.single("file"), edittieup);
router.route("/admin/tieup/:id/delete").delete(deletetieup);

router.route("/tieups").get(isAuthenticatedUser, getUserTieUps);

module.exports = router;
