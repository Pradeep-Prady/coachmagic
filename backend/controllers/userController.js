const catchAsyncError = require("../middlewares/catchAsyncError");
const axios = require("axios");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const TieUps = require("../models/tieupschema");
const { google } = require("googleapis");

const dayjsnew = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjsnew.extend(utc);
dayjsnew.extend(timezone);

dayjsnew.tz.setDefault("Asia/Kolkata");

const {
  forgotPasswordTemplate,
  passwordResetedTemplate,
} = require("../html/templates");
const dayjs = require("dayjs");

exports.checkUserId = catchAsyncError(async (req, res, next) => {
  const { userId } = req.body;

  const available = await User.findOne({ userId: userId });

  res.status(200).json({
    success: true,
    available,
  });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter a valid email and password", 400)
    );
  }

  // find user by email

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  updateLastActivity(user._id);
  getUserProfileInfo(user._id);

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 201, res);
});

// update user last login

const updateLastActivity = async (userId) => {
  try {
    const user = await User.findById(userId);

    user.lastLogin = new Date();
    await user.save();
  } catch (error) {
    console.error("Error updating last activity:", error);
  }
};
// Logout User - /api/v1/logout

exports.logoutUser = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "User logged out",
  });
};

// Get User Profile - /api/v1/myprofile
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const getUserProfileInfo = catchAsyncError(async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate({
        path: "invitesends.user",
        select: "name avatar",
      })
      .exec();

    if (!user) {
      return next(new ErrorHandler("User Not Found", 401));
    }

    updateLastActivity(user._id);

    const currentTime = dayjs();

    if (user.invitesends[user.invitesends.length - 1]) {
      const invite = user.invitesends[user.invitesends.length - 1];
      const toDate = dayjs(invite.date);

      const toTime = dayjs(invite.to);

      // 2024-01-06T12:25:43.000Z
      // 2024-01-05T03:30:00.000Z

      if (currentTime.format("DD-MM-YYYY") >= toDate.format("DD-MM-YYYY")) {
        if (
          currentTime > toTime &&
          invite.status !== -2 &&
          invite.status === 1
        ) {
          invite.status = -2;
          user.inviteSend = false;
        }

        if (currentTime > toTime && invite.status === 2) {
          invite.status = 4;
          // user.inviteSend = false;
        }
      }
    }
    if (user.invitegets.length > 0) {
      user.invitegets.forEach((invite) => {
        const toDate = dayjs(invite.date);
        const toTime = dayjs(invite.to);
        if (currentTime.format("DD-MM-YYYY") >= toDate.format("DD-MM-YYYY")) {
          if (
            currentTime > toTime &&
            invite.status !== -2 &&
            invite.status === 1
          ) {
            invite.status = -2;
          }

          if (currentTime > toTime && invite.status === 2) {
            invite.status = 4;
          }
        }
      });
    }

    // Assuming you have a database model or function to interact with your database
    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    if (user.google_access_token !== null && user.google_access_token) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(user.google_access_token.expiry_date);
      let isAccessTokenExpired = expiryDate < currentTime;

      if (isAccessTokenExpired) {
        if (user.google_access_token.refresh_token) {
          const refreshToken = user.google_access_token.refresh_token;
          const { tokens } = await oauth2Client.refreshToken(refreshToken);
          user.google_access_token = tokens;
        } else {
          user.google_access_token = null;
        }
      } else {
      }
    }
    await user.save();
  } catch (error) {
    console.log(error);
  }
});

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "invitesends.user",
        select: "name avatar",
      })
      .exec();

    if (!user) {
      return next(new ErrorHandler("User Not Found", 401));
    }

    updateLastActivity(user._id);

    const currentTime = dayjs();

    if (user.invitesends[user.invitesends.length - 1]) {
      const invite = user.invitesends[user.invitesends.length - 1];
      const toDate = dayjs(invite.date);

      const toTime = dayjs(invite.to);

      // 2024-01-06T12:25:43.000Z
      // 2024-01-05T03:30:00.000Z

      if (currentTime.format("DD-MM-YYYY") >= toDate.format("DD-MM-YYYY")) {
        if (
          currentTime > toTime &&
          invite.status !== -2 &&
          invite.status === 1
        ) {
          invite.status = -2;
          user.inviteSend = false;
        }

        if (currentTime > toTime && invite.status === 2) {
          invite.status = 4;
          // user.inviteSend = false;
        }
      }
    }
    if (user.invitegets.length > 0) {
      user.invitegets.forEach((invite) => {
        const toDate = dayjs(invite.date);
        const toTime = dayjs(invite.to);
        if (currentTime.format("DD-MM-YYYY") >= toDate.format("DD-MM-YYYY")) {
          if (
            currentTime > toTime &&
            invite.status !== -2 &&
            invite.status === 1
          ) {
            invite.status = -2;
          }

          if (currentTime > toTime && invite.status === 2) {
            invite.status = 4;
          }
        }
      });
    }

    // Assuming you have a database model or function to interact with your database
    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    if (user.google_access_token !== null && user.google_access_token) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(user.google_access_token.expiry_date);
      let isAccessTokenExpired = expiryDate < currentTime;

      if (isAccessTokenExpired) {
        if (user.google_access_token.refresh_token) {
          const refreshToken = user.google_access_token.refresh_token;
          const { tokens } = await oauth2Client.refreshToken(refreshToken);
          user.google_access_token = tokens;
        } else {
          user.google_access_token = null;
        }
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

// Update Profile - /api/v1/update/profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  try {
    let newUserData = {
      name: req.body.name,
      email: req.body.email,
      domain: req.body.domain,
      // avatar: avatar,
      phone: req.body.phone,
      bio: req.body.bio,
      knowAboutMe: req.body.knowAboutMe,
      tag: req.body.tag,
      slogan: req.body.slogan,
    };

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;

    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }

    if (req.file && req.file !== undefined) {
      avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
      newUserData = { ...newUserData, avatar };
    } else {
      avatar = `${BASE_URL}/uploads/user/Avatar.jpg`;
      newUserData = { ...newUserData, avatar };
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

// Update Skills - /api/v1/update/skills

exports.updateSkills = catchAsyncError(async (req, res, next) => {
  const skills = JSON.parse(req.body.skills);
  const ques = JSON.parse(req.body.ques);

  const newSkillData = {
    skills,
    ques,
    preceding: req.body.preceding,
    existing: req.body.existing,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newSkillData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Schedule - /api/v1/update/schedule

exports.updateSchedule = catchAsyncError(async (req, res, next) => {
  const newScheduleData = {
    days: req.body.days,
    unDays: req.body.unDays,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newScheduleData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Pricing - /api/v1/update/schedule

exports.updatePricing = catchAsyncError(async (req, res, next) => {
  const newPriceData = {
    audio: req.body.audio_fees,
    video: req.body.video_fees,
    freeTutoring: req.body.freeTutoring,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newPriceData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateCommunity = catchAsyncError(async (req, res, next) => {
  const { name, rollNo, code } = req.body;

  if (!name || !code) {
    return next(new ErrorHandler("Name and code are required fields", 400));
  }

  const newData = {
    community: {
      name,
      rollNo,
      code,
      active: true,
    },
  };

  const colleges = await TieUps.find();

  const isDuplicate = colleges.some(
    (col) =>
      col.partnername === name &&
      col.code === code &&
      col.students.some((student) => student.rollNo === rollNo)
  );

  if (isDuplicate) {
    const user = await User.findByIdAndUpdate(req.user._id, newData, {
      new: true,
      runValidators: true,
    });

    const tieUpToUpdate = await TieUps.findOne({
      partnername: name,
      code: code,
    });

    if (tieUpToUpdate) {
      tieUpToUpdate.students = tieUpToUpdate.students.map((student) => {
        if (student.rollNo === rollNo) {
          if (!student.used) {
            student.used = true;
            return student;
          } else {
            return next(new ErrorHandler("Roll No Already Used", 404));
          }
        }
        return student;
      });

      await tieUpToUpdate.save();
    } else {
      // Handle the case where no document is found
      return next(new ErrorHandler("No matching Data found", 404));
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } else {
    return next(new ErrorHandler("No matching Data found", 404));
  }
});

exports.updateCommunityActive = catchAsyncError(async (req, res, next) => {
  const { active } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 400));
  }

  user.community.active = active;

  user.save();

  return res.status(200).json({
    success: true,
    user,
  }); //
});

// Update School - /api/v1/update/school

exports.updateSchool = catchAsyncError(async (req, res, next) => {
  const { name, rollNo, code } = req.body;

  if (!name || !code) {
    return next(new ErrorHandler("Name and code are required fields", 400));
  }

  const newData = {
    school: {
      name,
      rollNo,
      code,
      active: true,
    },
  };

  const schools = await TieUps.find({ partnertype: "School" });

  const isDuplicate = schools.some(
    (col) =>
      col.partnername === name &&
      col.code === code &&
      col.students.some((student) => student.rollNo === rollNo)
  );

  if (isDuplicate) {
    const user = await User.findByIdAndUpdate(req.user._id, newData, {
      new: true,
      runValidators: true,
    });

    const tieUpToUpdate = await TieUps.findOne({
      partnername: name,
      code: code,
    });

    if (tieUpToUpdate) {
      tieUpToUpdate.students = tieUpToUpdate.students.map((student) => {
        if (student.rollNo === rollNo) {
          if (!student.used) {
            student.used = true;
            return student;
          } else {
            return next(new ErrorHandler("Roll No Already Used", 404));
          }
        }
        return student;
      });

      await tieUpToUpdate.save();
    } else {
      return next(new ErrorHandler("No matching Data found", 404));
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } else {
    return next(new ErrorHandler("No matching Data found", 404));
  }
});

exports.updateSchoolActive = catchAsyncError(async (req, res, next) => {
  const { active } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 400));
  }

  user.school.active = active;

  user.save();

  return res.status(200).json({
    success: true,
    user,
  }); //
});

// Admin : Get All Users -

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Admin : Get Specific User -
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin : Update User -

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin : Delete User -

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});

// Forgot User - /api/v1/password/forgot

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this Email", 404));
  }

  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  //create reset url

  let BASE_URL = process.env.FRONTEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  const resetUrl = `${BASE_URL}/reset/${resetToken}`;

  try {
    sendEmail({
      email: user.email,
      subject: "Reset Your Coach Magic Password",
      html: forgotPasswordTemplate(user.name, resetUrl),
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (e) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(e.message, 500));
  }
});

// Reset User - /api/v1/reset/:token

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token Invalid or Expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save({ validateBeforeSave: false });

  sendEmail({
    email: user.email,
    subject: "Your Coach Magic Password Has Been Changed",
    html: passwordResetedTemplate(user.name),
  });

  sendToken(user, 201, res);
});
