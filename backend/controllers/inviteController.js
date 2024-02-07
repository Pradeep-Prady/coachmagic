const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const { ObjectId } = require("mongodb");
const sendEmail = require("../utils/email");
const {
  sendInviteTemplate,
  myinviteSendedTemplate,
  inviteAcceptedTemplate,
  inviteRejectedTemplate,
} = require("../html/templates");

const { google } = require("googleapis");

const calender = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
});

const { v4 } = require("uuid");
const sendToken = require("../utils/jwt");
const dayjs = require("dayjs");
const { encodeXText } = require("nodemailer/lib/shared");

exports.getUsers = catchAsyncError(async (req, res, next) => {
  const resPerPage = 13;

  let buildQuery = () => {
    return new APIFeatures(User.find(), req.query).search().tag().exp();
  };

  const allusers = await buildQuery().paginate(resPerPage).query;

  const users = allusers
    .filter((user) => user.id !== req.user.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const filteredUsersCount = await buildQuery().query.countDocuments({});

  res.status(200).json({
    success: true,
    count: filteredUsersCount,
    resPerPage,
    users,
  });
});

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

exports.createInvite = catchAsyncError(async (req, res, next) => {
  const { userId, date, from, to, mode, servicename, question, price } =
    req.body;

  const fromT = new Date(from);
  const toT = new Date(to);

  const TD = toT - fromT;
  const TDM = TD / (1000 * 60);

  const invitesendUser = await User.findById(req.user.id);
  const invitegetUser = await User.findById(userId);

  // let price;

  // if (invitesendUser.totalInvitesAttend == 0) {
  //   if (mode === "Audio") {
  //     price = invitegetUser.audio * TDM;
  //   } else {
  //     price = invitegetUser.video * TDM;
  //   }
  // } else {
  //   price = 0;
  // }

  const inviteget = {
    date,
    from,
    to,
    mode,
    servicename,
    question,
    price: price,
    user: req.user.id,
  };

  if (!invitesendUser.inviteSend) {
    invitesendUser.inviteSend = true;

    invitegetUser.invitegets.push(inviteget);

    await invitegetUser.save({ validateBeforeSave: false });

    const userObjectId = new ObjectId(req.user.id);

    const IID = invitegetUser.invitegets.find(
      (invite) =>
        userObjectId.toString() === invite.user.toString() &&
        invite.mode === mode &&
        invite.question === question &&
        invite.servicename === servicename &&
        invite.date === date &&
        invite.from === from &&
        invite.to === to
    );

    const invitesend = {
      date,
      from,
      to,
      mode,
      servicename,
      question,
      price: price,
      user: userId,
      inviteId: IID._id,
    };

    invitesendUser.invitesends.push(invitesend);

    let BASE_URL = process.env.FRONTEND_URL;

    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }

    const invitedetails = `${BASE_URL}/inviteget/${IID._id}`;

    // invite created user
    sendEmail({
      email: invitesendUser.email,
      subject: `Your Invite is Successfully Sent to ${invitegetUser.name} 😉`,
      html: myinviteSendedTemplate(invitesendUser.name),
    });

    // invite received user

    sendEmail({
      email: invitegetUser.email,
      subject: `New Meeting Invite from ${invitesendUser.name}😊`,
      html: sendInviteTemplate(invitesendUser.name, servicename, invitedetails),
    });

    await invitesendUser.save({ validateBeforeSave: false });
  } else {
    return next(new ErrorHandler("You Already have active Invite", 300));
  }

  res.status(200).json({
    status: "success",

    invitegetUser,
    invitesendUser,
  });
});

exports.getInvites = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "invitesends.user",
      select: "name avatar",
    })
    .exec();

  if (!user) {
    return next(new ErrorHandler("User Not Found", 401));
  }

  // const currentTime = new Date();

  // if (user.invitesends[user.invitesends.length - 1]) {
  //   const invite = user.invitesends[user.invitesends.length - 1];
  //   const toDateTime = new Date(invite.to);

  //   if (currentTime > toDateTime && invite.status !== -2) {
  //     invite.status = -2;
  //     user.inviteSend = false;
  //   }
  // }

  // if (user.invitegets.length > 0) {
  //   user.invitegets.forEach((invite) => {
  //     const inviteToDateTime = new Date(invite.to);
  //     if (currentTime > inviteToDateTime && invite.status !== -2) {
  //       invite.status = -2;
  //     }
  //   });
  // }

  const currentTime = dayjs();

  if (user.invitesends[user.invitesends.length - 1]) {
    const invite = user.invitesends[user.invitesends.length - 1];
    const toDate = dayjs(invite.date);
    const toTime = dayjs(invite.to);
    if (currentTime.format("DD-MM-YYYY") >= toDate.format("DD-MM-YYYY")) {
      if (currentTime > toTime && invite.status !== -2 && invite.status === 1) {
        invite.status = -2;
        user.inviteSend = false;
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
      }
    });
  }

  await user.save();

  res.status(200).json({
    status: "success",
    invites: user.invitegets,
  });
});

exports.getInvite = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const inviteId = req.params.id;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const invite = user.invitegets.find((invite) =>
    invite._id.equals(new ObjectId(inviteId))
  );

  if (!invite) {
    return next(new ErrorHandler("Invite not found", 404));
  }

  let invitedUser = await User.findById({ _id: invite.user });

  let name = invitedUser.name;
  res.status(200).json({
    status: "success",
    invite: invite,
    invitedUserName: name,
  });
});

exports.sendInvites = catchAsyncError(async (req, res, next) => {
  const resPerPage = 2;

  const user = await User.findById(req.user.id).populate({
    path: "invitesends.user",
    select: "name avatar",
  });

  // const currentTime = new Date();

  // if (user.invitesends[user.invitesends.length - 1]) {
  //   const invite = user.invitesends[user.invitesends.length - 1];
  //   const toDateTime = new Date(invite.to);

  //   if (currentTime > toDateTime && invite.status !== -2) {
  //     invite.status = -2;
  //     user.inviteSend = false;
  //   }
  // }

  const currentTime = dayjs();

  if (user.invitesends[user.invitesends.length - 1]) {
    const invite = user.invitesends[user.invitesends.length - 1];
    const toDate = dayjs(invite.date);
    const toTime = dayjs(invite.to);
    if (currentTime.format("DD-MM-YYYY") >= toDate.format("DD-MM-YYYY")) {
      if (currentTime > toTime && invite.status !== -2 && invite.status === 1) {
        invite.status = -2;
        user.inviteSend = false;
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
      }
    });
  }

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.invitesends.sort((a, b) => b.createdAt - a.createdAt);

  const page = parseInt(req.query.page) || 1;
  const startIndex = (page - 1) * resPerPage;
  const endIndex = page * resPerPage;

  const invites = user.invitesends.slice(startIndex, endIndex);

  const filteredInvitesCount = user.invitesends.length;

  res.status(200).json({
    status: "success",
    invites,
    resPerPage,
    count: invites.length,
    totalPages: Math.ceil(filteredInvitesCount / resPerPage),
    currentPage: page,
    total: filteredInvitesCount,
  });
});

exports.clearSendInvites = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await User.updateOne(
    { _id: user._id },
    { $pull: { invitesends: { status: { $in: [0, -1, -2, 5] } } } }
  );

  res.status(200).json({
    status: "success",
  });
});

exports.clearGetInvites = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await User.updateOne(
    { _id: user._id },
    { $pull: { invitegets: { status: { $in: [0, -1, -2, 5] } } } }
  );

  res.status(200).json({
    status: "success",
  });
});

// for dashboard
exports.getInvitesForDash = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  let total = user.invitegets.reduce(
    (acc, inviteget) => inviteget.price + acc,
    0
  );

  let count = user.invitegets.length;

  res.status(200).json({
    status: "success",
    total,
    count,
  });
});

// Make Google Meet
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

exports.getGoogle = catchAsyncError(async (req, res, next) => {
  try {
    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    res.status(200).json({
      status: "success",
      url: url,
    });
  } catch (e) {
    console.log(e);
  }
});

exports.getGoogleRedirect = catchAsyncError(async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User not found"));
    }

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      const ti = {
        access_token: tokens.access_token,
        expiry_date: tokens.expiry_date,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
      };
      user.google_access_token = ti;

      await user.save();

      res.status(200).json({
        success: true,
        result: ti,
      });
    } catch (tokenError) {

      console.error("Error retrieving Google tokens:", tokenError);
      return next(new ErrorHandler("Error retrieving Google tokens"));
    }
  } catch (err) {
    console.log(err);
  }
});

// if (!user.google_access_token) {
//   const { tokens } = await oAuth2Client.getToken(code);
//   if (tokens) {
//     oAuth2Client.setCredentials(tokens);
//   }
//   8240;

exports.scheduleEvent = catchAsyncError(async (req, res, next) => {
  try {
    const scopes = ["https://www.googleapis.com/auth/calendar"];

    oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    const { inviteID, date, from, to, des, userId } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User not found"));
    }

    const inviteUser = await User.findById(userId);

    if (!inviteUser) {
      return next(new ErrorHandler("Couldn't find Invite User"));
    }

    const isAccessTokenExpired = (expiryDate) => {
      // Get the current time in milliseconds
      const currentTime = new Date().getTime();

      // Compare the expiry date with the current time
      return expiryDate < currentTime;
    };

    if (
      user.google_access_token &&
      user.google_access_token !== null &&
      user.google_access_token.refresh_token
    ) {
      const isExpired = isAccessTokenExpired(
        user.google_access_token.expiry_date
      );

      if (isExpired) {
        const refreshToken = user.google_access_token.refresh_token;
        const { tokens } = await oAuth2Client.refreshToken(refreshToken);
        user.google_access_token = tokens;
      }
    }
    // else {
    //   return next(new ErrorHandler("Please Connect Google Calendar"));
    // }

    oAuth2Client.setCredentials(user.google_access_token);

    // set time

    const inviteToUpdate = user.invitegets.find((invite) =>
      invite._id.equals(new ObjectId(inviteID))
    );

    const dateForMeet = date.slice(0, 10);
    const timeFrom = inviteToUpdate.from.slice(11, 16);
    const timeTo = inviteToUpdate.to.slice(11, 16);

    const startTimeString = `${dateForMeet}T${timeFrom}:00.000`;
    const endTimeString = `${dateForMeet}T${timeTo}:00.000`;

    console.log(startTimeString, endTimeString, dateForMeet, timeFrom, timeTo);

    // 2024-01-20T0:00:00.000 2024-01-20T0:15:00.000 2024-01-20 0:00 0:15
    // 2024-01-19T0:00:00.000 2024-01-19T0:15:00.000 2024-01-19 0:00 0:15
    // 2024-01-19T10:00:00.000

    const result = await calender.events.insert({
      calendarId: "primary",
      auth: oAuth2Client,
      conferenceDataVersion: 1,
      requestBody: {
        summary: des,
        description: inviteToUpdate.question,
        start: {
          dateTime: startTimeString,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endTimeString,
          timeZone: "Asia/Kolkata",
        },
        conferenceData: {
          createRequest: {
            requestId: v4(),
          },
        },
        attendees: [
          {
            // email: "pradeepmahendran2019@gmail.com",
            email: inviteUser.email,
          },
        ],
      },
    });

    if (!inviteToUpdate) {
      return next(new ErrorHandler("Invite not found", 404));
    }

    const inviteFromUpdate = inviteUser.invitesends.find(
      (invite) => invite.inviteId === inviteID
    );

    if (!inviteFromUpdate) {
      return next(new ErrorHandler("Invite not found", 404));
    }

    // if (result) {
    //   user.totalInvitesAttend += 1;
    // }

    if (result) {
      inviteToUpdate.meetUrl = result.data.hangoutLink;
      inviteFromUpdate.meetUrl = result.data.hangoutLink;
    }

    await inviteUser.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      scheduleGoogleMeet: result.data.hangoutLink,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.updateGetInvite = catchAsyncError(async (req, res, next) => {
  const { inviteID, status, InviteUserID, ror } = req.body;

  const user = await User.findById(req.user.id);

  const inviteToUpdate = user.invitegets.find((invite) =>
    invite._id.equals(new ObjectId(inviteID))
  );

  if (!inviteToUpdate) {
    return next(new ErrorHandler("Invite not found", 404));
  }

  const inviteUser = await User.findById(InviteUserID);

  const inviteFromUpdate = inviteUser.invitesends.find(
    (invite) => invite.inviteId === inviteID
  );

  inviteFromUpdate.status = status;

  if (status === 0) {
    inviteUser.inviteSend = false;
  }

  if (ror) {
    inviteFromUpdate.ror = ror;
  }

  inviteToUpdate.status = status;

  let BASE_URL = process.env.FRONTEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  let sub;
  let content;
  if (status === 2) {
    sub = ` Your Meeting Invite is Accepted ☺`;
    content = inviteAcceptedTemplate(inviteUser.name);
  } else {
    sub = `Your Meeting Invite is Rejected 🥺 `;
    content = inviteRejectedTemplate(inviteUser.name, ror);
  }

  sendEmail({
    email: inviteUser.email,
    subject: sub,
    html: content,
  });

  await inviteUser.save({ validateBeforeSave: false });

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    user,
    inviteUser,
  });
});

exports.getLastInvite = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  let l = user.invitesends.length - 1;
  lInvite = user.invitesends[l];

  const lastInviteWithUser = await User.populate(lInvite, {
    path: "user",
    select: "name avatar",
  });

  res.status(200).json({
    status: "success",
    invite: lastInviteWithUser,
  });
});

exports.sendFeedback = catchAsyncError(async (req, res, next) => {
  const { inviteId, InviteUserId, meetHappend, rating, feedback, reason } =
    req.body;

  const user = await User.findById(req.user.id);

  const inviteFromUpdate = user.invitesends.find((invite) =>
    invite._id.equals(new ObjectId(inviteId))
  );

  if (!inviteFromUpdate) {
    return next(new ErrorHandler("Invite not found", 404));
  }

  const inviteUser = await User.findById(InviteUserId);

  const inviteToUpdate = inviteUser.invitegets.find((invite) =>
    invite._id.equals(new ObjectId(inviteFromUpdate.inviteId))
  );

  const data = {
    meetHappend: meetHappend,
    rating: rating,
    feedback: feedback,
    reason: reason,
  };

  inviteFromUpdate.feedback = data;
  inviteToUpdate.feedback = data;

  inviteFromUpdate.status = 5;
  inviteToUpdate.status = 5;

  user.inviteSend = false;
  inviteToUpdate.totalInvitesAttend += 1;

  await inviteUser.save({ validateBeforeSave: false });
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    invite: inviteFromUpdate,
  });
});
