const catchAsyncError = require("../middlewares/catchAsyncError");
const GeneralQuery = require("../models/generalQueryModel");
const CommunityQuery = require("../models/communityQueryModel");
const ErrorHandler = require("../utils/errorHandler");

const TieUps = require("../models/tieupschema");
const csv = require("csvtojson");

// Create a General Query

exports.newGeneralQuery = catchAsyncError(async (req, res, next) => {
  const { feedbacktype, name, reason } = req.body;

  let fakeAccountName;
  
  if (req.body.fakeAccountName) {
    fakeAccountName = req.body.fakeAccountName;
  }

  let proof;

  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    proof = `${BASE_URL}/uploads/query/${req.file.originalname}`;
  }

  const generalQuery = await GeneralQuery.create({
    feedbacktype,
    name,
    fakeAccountName,
    reason,
    proof,
  });
  res.status(200).json({
    status: "success",
    generalQuery,
  });
});

// Admin

// Get a General Queries

exports.getGeneralQueries = catchAsyncError(async (req, res, next) => {
  const generalQueries = await GeneralQuery.find();

  res.status(200).json({
    status: "success",
    generalQueries,
  });
});

// Get Specific Query

exports.getSingleGeneralQuery = catchAsyncError(async (req, res, next) => {
  const generalQuery = await GeneralQuery.findById(req.params.id);

  if (!generalQuery) {
    return next(new ErrorHandler("General Query not found", 404));
  }

  res.status(200).json({
    status: "success",
    generalQuery,
  });
});

// Update Specific Query

exports.updateSingleGeneralQuery = catchAsyncError(async (req, res, next) => {
  const statusoffeedback = req.body.statusoffeedback;

  const generalQuery = await GeneralQuery.findByIdAndUpdate(
    req.params.id,
    { statusoffeedback },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    generalQuery,
  });
});

exports.deleteGeneralQuery = catchAsyncError(async (req, res, next) => {
  const generalQuery = await GeneralQuery.findById(req.params.id);
  if (!generalQuery) {
    return next(new ErrorHandler("General Query not found", 404));
  }
  await GeneralQuery.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});

// Community Query

// Create a Community Query

exports.newCommunityQuery = catchAsyncError(async (req, res, next) => {
  const { name, domain, servicename, question, qussituation } = req.body;

  const communityQuery = await CommunityQuery.create({
    name,
    domain,
    servicename,
    question,
    qussituation,
  });
  res.status(200).json({
    status: "success",
    communityQuery,
  });
});

// Admin

// Get a Community Queries

exports.getCommunityQueries = catchAsyncError(async (req, res, next) => {
  const communityQueries = await CommunityQuery.find();

  res.status(200).json({
    status: "success",
    communityQueries,
  });
});

// Get Specific Community Query

exports.getSingleCommunityQuery = catchAsyncError(async (req, res, next) => {
  const communityQuery = await CommunityQuery.findById(req.params.id);

  if (!communityQuery) {
    return next(new ErrorHandler("Community Query not found", 404));
  }

  res.status(200).json({
    status: "success",
    communityQuery,
  });
});

// Update Specific Community Query

exports.updateSingleCommunityQuery = catchAsyncError(async (req, res, next) => {
  const statusofquery = req.body.statusofquery;

  const communityQuery = await CommunityQuery.findByIdAndUpdate(
    req.params.id,
    { statusofquery },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    communityQuery,
  });
});

// Delete Specific Community Query

exports.deleteCommunityQuery = catchAsyncError(async (req, res, next) => {
  const communityQuery = await CommunityQuery.findById(req.params.id);
  if (!communityQuery) {
    return next(new ErrorHandler("Community Query not found", 404));
  }
  await CommunityQuery.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});

//TieUp

exports.getTieUps = catchAsyncError(async (req, res, next) => {
  const tieUps = await TieUps.find();

  res.status(200).json({
    status: "success",
    tieUps,
  });
});

exports.addtieup = catchAsyncError(async (req, res, next) => {
  const {
    // partnertype,
    partnername,
    partneremail,
    code,
    subscriptionyears,
    amountstatus,
    amount,
  } = req.body;

  let students = [];
  let addTieup;

  if (req.file) {
    try {
      const response = await csv().fromFile(req.file.path);
      for (let x = 0; x < response.length; x++) {
        students.push({
          email: response[x].Email,
          rollNo: response[x].RollNo,
          used: false,
        });
      }

      addTieup = await TieUps.create({
        // partnertype,
        partnername,
        partneremail,
        code,
        subscriptionyears,
        amountstatus,
        amount,
        students,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Failed to process CSV file.",
      });
    }
  } else {
    try {
      addTieup = await TieUps.create({
        // partnertype,
        partnername,
        partneremail,
        code,
        subscriptionyears,
        amountstatus,
        amount,
        students,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Failed to create TieUp without CSV.",
      });
    }
  }

  res.status(200).json({
    status: "success",
    addTieup,
  });
});

exports.viewtieup = catchAsyncError(async (req, res, next) => {
  const TieUp = await TieUps.findById(req.params.id);
  if (!TieUp) {
    return next(new ErrorHandler("Cannot found TieUp", 404));
  }
  res.status(200).json({
    status: "success",
    TieUp,
  });
});

exports.edittieup = catchAsyncError(async (req, res, next) => {
  const {
    partnertype,
    partnername,
    partneremail,
    code,
    subscriptionyears,
    amountstatus,
    amount,
  } = req.body;

  let students = [];
  let tieUp;

  const checkTieUp = await TieUps.findById(req.params.id);
  if (!checkTieUp) {
    return next(new ErrorHandler("Cannot found Tieup", 404));
  }
  if (req.file) {
    try {
      const response = await csv().fromFile(req.file.path);

      for (let x = 0; x < response.length; x++) {
        students.push({
          email: response[x].Email,
          rollNo: response[x].RollNo,
        });
      }
      const updatefields = {
        partnertype,
        partnername,
        partneremail,
        code,
        subscriptionyears,
        amountstatus,
        amount,
        students,
      };

      tieUp = await TieUps.findByIdAndUpdate(req.params.id, updatefields);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Failed to process CSV file.",
      });
    }
  } else {
    try {
      const updatefields = {
        partnertype,
        partnername,
        partneremail,
        code,
        subscriptionyears,
        amountstatus,
        amount,
        students,
      };
      tieUp = await TieUps.findByIdAndUpdate(req.params.id, updatefields);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Failed to create TieUp without CSV.",
      });
    }
  }

  res.status(200).json({
    status: "success",
    tieUp,
  });
});

exports.deletetieup = catchAsyncError(async (req, res, next) => {
  const DeleteTieUp = await TieUps.findById(req.params.id);
  if (!DeleteTieUp) {
    return next(new ErrorHandler("Cannot found Tieup", 404));
  }
  await TieUps.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
  });
});

// User Tieups

exports.getUserTieUps = catchAsyncError(async (req, res, next) => {
  const tieUps = await TieUps.find();

  // const schools = tieUps.filter((tieup) => tieup.partnertype === "School");

  // if (!schools) {
  //   return next(new ErrorHandler("No Schools Found", 404));
  // }
  // const colleges = tieUps.filter((tieup) => tieup.partnertype === "College");

  // if (!colleges) {
  //   return next(new ErrorHandler("No Colleges Found", 404));
  // }

  res.status(200).json({
    status: "success",
    tieUps,
  });
});
