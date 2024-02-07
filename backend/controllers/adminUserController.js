const catchAsyncError = require("../middlewares/catchAsyncError");
const AdminUser = require("../models/adminModel");
const sendAdminToken = require("../utils/adminjwt");
const ErrorHandler = require("../utils/errorHandler");

exports.registerAdminUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, phone, position } = req.body;

  const adminUser = await AdminUser.create({
    name,
    email,
    password,
    phone,
    position,
  });

  res.status(200).json({
    success: true,
    adminUser,
  });
});

exports.loginAdminUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter a valid email and password", 400)
    );
  }

  const adminUser = await AdminUser.findOne({ email }).select("+password");

  if (!adminUser) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  if (!(await adminUser.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendAdminToken(adminUser, 201, res);
});

exports.getAdminUserProfile = catchAsyncError(async (req, res, next) => {
  const adminUser = await AdminUser.findById(req.adminUser._id);

  res.status(200).json({
    success: true,
    adminUser,
  });
});

exports.getAdminUsers = catchAsyncError(async (req, res, next) => {
  const adminUsers = await AdminUser.find();

  res.status(200).json({
    success: true,
    adminUsers,
  });
});

exports.getAdminUser = catchAsyncError(async (req, res, next) => {
  const adminUser = await AdminUser.findById(req.params.id);
  if (!adminUser) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    adminUser,
  });
});

exports.updateAdminUser = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, position, password } = req.body;

  const adminUser = await AdminUser.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, position, password },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    adminUser,
  });
});

exports.deleteAdminUser = catchAsyncError(async (req, res, next) => {
  const adminUser = await AdminUser.findById(req.params.id);

  if (!adminUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  await AdminUser.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
  });
});
