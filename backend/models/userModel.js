const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const passwordValidator = (value) => {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
  return passwordRegex.test(value);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userId: {
    type: String,
    required: [true, "Please enter User ID"],
    unique: true,
    validate: {
      validator: (userId) => /^[a-z0-9_.-]+$/.test(userId),
      message:
        "User ID must contain only lowercase letters, numbers, _, ., and -",
    },
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    validate: {
      validator: passwordValidator,
      message:
        "Password must be 8 to 12 characters with at least one number and one special character (!@#$%^&*)",
    },
    select: false,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },

  domain: {
    // required: true,
    type: String,
    trim: true,
  },
  phone: {
    // required: true,
    type: String,
  },
  bio: {
    type: String,
    trim: true,
  },
  knowAboutMe: {
    type: String,
    trim: true,
  },
  tag: {
    type: String,
  },
  slogan: [
    {
      // required: true,
      type: [String],
      default: [
        "Empowering Growth,One Lesson at a Time",
        "Visionaries Unite,Progress Take Flight",
        "Warrior Spirit:Defying Odds,Achieving Greatness",
      ],
      trim: true,
    },
  ],

  skills: [
    {
      skill: {
        type: String,
        trim: true,
      },
      yearsOfExp: {
        type: Number,
        trim: true,
      },
    },
  ],
  ques: [
    {
      qus: {
        type: String,
        trim: true,
      },
    },
  ],
  preceding: {
    type: String,
    trim: true,
  },
  existing: {
    type: String,
    trim: true,
  },

  timezone: {
    type: String,
  },

  days: [
    {
      name: {
        type: String,
      },
      timeSlots: [
        {
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
      ],
    },
  ],
  unDays: [
    {
      type: String,
    },
  ],

  audio: {
    type: Number,
  },
  video: {
    type: Number,
  },
  freeTutoring: Boolean,
  inviteSend: Boolean,

  community: {
    name: String,
    rollNo: String,
    code: String,
    active: Boolean,
  },
  school: {
    name: String,
    rollNo: String,
    code: String,
    active: Boolean,
  },

  google_access_token: Object,

  chatGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  totalInvitesAttend: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  invitesends: [
    {
      date: String,
      from: String,
      to: String,
      mode: String,
      servicename: String,
      question: String,
      inviteId: String,
      meetUrl: String,
      status: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        default: 0,
      },
      ror: String,
      feedback: {
        meetHappend: Boolean,
        rating: Number,
        feedback: String,
        reason: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  invitegets: [
    {
      date: String,
      from: String,
      to: String,
      mode: String,
      servicename: String,
      question: String,
      meetUrl: String,

      status: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        default: 0,
      },
      feedback: {
        meetHappend: Boolean,
        rating: Number,
        feedback: String,
        reason: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.isValidPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function () {
  // Generate a token
  const token = crypto.randomBytes(20).toString("hex");

  // Generate hash and set to resetPasswordToken

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Set token expiration time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};

const model = mongoose.model("User", userSchema);
module.exports = model;
