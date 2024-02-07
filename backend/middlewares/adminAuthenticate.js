const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminModel");

exports.isAuthenticatedAdminUser = catchAsyncError(async (req, res, next) => {
  const { cmat } = req.cookies;

  if (!cmat) {
    return next(new ErrorHandler("Login first to assess this resource", 401));
  }

  const decoded = jwt.verify(cmat, process.env.JWT_SECRET);

  req.adminUser = await AdminUser.findById(decoded.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.adminUser.role)) {
      return next(
        new ErrorHandler(
          `${req.adminUser.role} are not authorized to perform this action`,
          403
        )
      );
    }
    next();
  };
};
