const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  
  const { token } = req.cookies;

  // console.log('coming here', token)

  if (!token) {
    return next(new ErrorHandler("Login first to assess this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});

exports.isGoogleAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { Gt } = req.cookies;

  if (!Gt) {
    return next(
      new ErrorHandler("Login Google first to assess this resource", 401)
    );
  }

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} are not authorized to perform this action`,
          403
        )
      );
    }
    next();
  };
};
