const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../model/authmodel");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleWare/middleWare");
/*
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YmU4ZjJhOWM1MmU3NTg1ZGE3NzA4YiIsImlhdCI6MTY5MDIxMTA3M30.wNspX0_kikbv2BUjaIQpIgj0G4nJzfbVTxGC1ZG4Kyo",
  "user": {
    "_id": "64be8f2a9c52e7585da7708b",
    "name": "maitheen",
    "email": "maitheen190@gmail.com",
    "password": "$2a$08$D6cp0sblc5b75LKd9AAzDOf3S/1F8tq88d1ImGbJQK52rlC.lCz4.",
    "__v": 0
  }
}
*/

// Sign Up
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({
      error: e.message,
      message: "Pleae enter data",
    });
  }
});

// Sign In

authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user.id }, "passwordKey");
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/user/register", async (req, res) => {
  try {
    const {
      Name,
      email,
      password,
      domain,
      phonenumber,
      bio,
      knowAboutMe,
      tag,
      slogan,
      skills,
      preceding,
      existing,
      timezone,
      schedule,
    } = req.body;
    const newUser = new User({
      Name: Name,
      email: email,
      password: password,
      domain: domain,
      phonenumber: phonenumber,
      bio: bio,
      knowAboutMe: knowAboutMe,
      tag: tag,
      slogan: slogan,
      skills: skills,
      preceding: preceding,
      existing: existing,
      timezone: timezone,
      schedule: schedule,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log("Error: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

authRouter.put("/user/update", auth, async (req, res) => {
  try {
    const { name, email, _id } = req.body;
    const userd = await User.findById({ _id });
    // console.log(userd)
    // console.log(_id);

    // const hashedPassword = await bcryptjs.hash(password, 8);
    // console.log(hashedPassword)
    // const isMatch = await bcryptjs.compare(password, userd.password);
    // if (!isMatch) {
    //   return res.status(400).json({ msg: "Incorrect password." });

    // }

    const user = await User.findByIdAndUpdate(_id, {
      email: email,
      name: name,
    });
    console.log(user);
    const userData = await user.save();

    res.json(userData);
  } catch (e) {
    res.json({ error: e });
  }
});
authRouter.put("/user/password/change", auth, async (req, res) => {
  try {
    const { oldpassword, newpassword, _id } = req.body;
    const userd = await User.findById({ _id });
    console.log(userd.password);

    const isMatch = await bcryptjs.compare(oldpassword, userd.password);
    const hashedPassword = await bcryptjs.hash(newpassword, 8);

    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    } else {
      console.log(oldpassword);
      const user = await User.findByIdAndUpdate(_id, {
        password: hashedPassword,
      });
      const userData = await user.save();

      res.json(userData);
    }
  } catch (e) {
    res.json({ error: e });
  }
});

authRouter.delete("/user/delete", auth, async (req, res) => {
  const { _id, password } = req.body;

  try {
    const userd = await User.findById({ _id });
    console.log("is notmatched");

    const isMatch = await bcryptjs.compare(password, userd.password);
    console.log("ismatched");
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }
    console.log("userd");
    const user = await User.findByIdAndDelete(_id);
    console.log("userd");

    res.json({
      message: "user deleted successfully",
      data: user,
    });
  } catch (e) {
    res.json({ error: "user does not exisets" });
  }
});
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get profile user data
authRouter.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});
//get user education&skills data
authRouter.get("/profile/education&skills", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});
// get schedule deatils
authRouter.get("/profile/schedule", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});
//display the user data
authRouter.get("/profile", auth, async (req, res) => {
  try {
    const userdetail = await User.findOne({ _id: req.user });
    if (!userdetail) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      profileimg: userdetail.profileimg,
      name: userdetail.Name,
      Domain: userdetail.domain,
      Tag: userdetail.tag,
      Slogan: userdetail.slogan,
      Bio: userdetail.bio,
      Skills: userdetail.skills,
      Preceding: userdetail.preceding,
      Existing: userdetail.existing,
      KnowAboutMe: userdetail.knowAboutMe,
    });
  } catch (error) {
    console.error("Error in fetching personal info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// user invite
authRouter.get("/search", async (req, res) => {
  try {
    const searchText = req.query.text;

    const users = await User.find(
      {
        $or: [
          { Name: { $regex: searchText, $options: "i" } },
          { "skills.skill": { $regex: searchText, $options: "i" } },
          { preceding: { $regex: searchText, $options: "i" } },
          { existing: { $regex: searchText, $options: "i" } },
        ],
      },
      {
        _id: 0,
        profileimg: 1,
        Name: 1,
        domain: 1,
        "schedule.time": 1,
        amount: 1,
      }
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// highest to lowest amount
authRouter.get("/high-to-low", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ amount: -1 })
      .select("-_id Name domain schedule.time amount");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occured while filtering" });
  }
});

// lowest to highest amount
authRouter.get("/low-to-high", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ amount: 1 })
      .select("-_id Name domain schedule.time amount");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occured while filtering" });
  }
});

// filter by experience
authRouter.get("/filter-by-experience", async (req, res) => {
  try {
    const { experience } = req.query;
    const experienceRanges = {
      "0-1": { $gte: 0, $lte: 1 },
      "2-4": { $gte: 2, $lte: 4 },
      "4-6": { $gte: 4, $lte: 6 },
      "7-8": { $gte: 7, $lte: 8 },
      "9+": { $gte: 9 },
    };

    const users = await User.find({
      "skills.yearsOfExp": experienceRanges[experience],
    }).select("-_id Name domain schedule.time amount");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occured while filtering users." });
  }
});

// filter by AM or PM
authRouter.get("/filter-by-am-pm/:period", async (req, res) => {
  try {
    const { period } = req.params;
    const isAM = period.toLowerCase() === "am";

    const filteredData = await User.find({}).exec();

    const result = filteredData
      .filter((item) => item.schedule && Array.isArray(item.schedule))
      .map((item) => {
        const matchingTimes = item.schedule
          .filter((scheduleItem) => {
            const timeLower = scheduleItem.time.toLowerCase();
            return (
              (isAM && timeLower.includes("am")) ||
              (!isAM && timeLower.includes("pm"))
            );
          })
          .map((scheduleItem) => scheduleItem.time);

        if (matchingTimes.length > 0) {
          return {
            _id: item._id,
            Name: item.Name,
            domain: item.domain,
            amount: item.amount,
            time: matchingTimes,
          };
        }

        return null;
      })
      .filter(Boolean);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while filtering users." });
  }
});

// filter by budget
authRouter.get("/filter-by-budget", async (req, res) => {
  try {
    const { budget } = req.query;
    const budgetRanges = {
      "under-100": { $lt: 100 },
      "100-300": { $gte: 100, $lte: 300 },
      "300-600": { $gte: 300, $lte: 600 },
      "600-900": { $gte: 600, $lte: 900 },
    };

    const users = await User.find({
      amount: budgetRanges[budget],
    }).select("-_id Name domain schedule.time amount");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while filtering users." });
  }
});

// pricing
authRouter.put("/pricing/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { audioPrice, videoPrice } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.amount = {
      audio: audioPrice,
      video: videoPrice,
    };

    await user.save();
    res.json({ message: "Pricing updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured while update pricing" });
  }
});

// Requset Service
authRouter.post("/request-service", async (req, res) => {
  try {
    const { userId, from, to, mode, serviceName, question } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const costResponse = await calculateCost(
      userId,
      from,
      to,
      mode,
      user.serviceRequests
    );

    if (costResponse.error) {
      return res
        .status(500)
        .json({ error: "An error occured while calculating cost" });
    }

    const { totalCost } = costResponse;

    const serviceRequest = {
      from,
      to,
      mode,
      serviceName,
      question,
      cost: totalCost,
    };

    user.serviceRequests.push(serviceRequest);

    await user.save();

    res.status(201).json({
      message: "Service Request created",
      user: {
        name: user.Name,
      },
      serviceRequest: {
        serviceName: serviceName,
        question: question,
        mode: mode,
        from: from,
        to: to,
        totalCost: totalCost,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error while creating the service request" });
  }
});

async function calculateCost(userId, from, to, mode) {
  try {
    const response = await fetch(`http://localhost:3000/calculate-cost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, from, to, mode }),
    });

    if (!response.ok) {
      throw new Error("Failed to calculate cost");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: true };
  }
}

// Calculate Cost
authRouter.post("/calculate-cost", async (req, res) => {
  try {
    const { userId, from: reqFrom, to: reqTo, mode: reqMode } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const costPerMin = user.amount[0][reqMode];

    if (!costPerMin) {
      return res.status(400).json({ error: "Invalid mode" });
    }

    const fromTime = parseTimeString(reqFrom);
    const toTime = parseTimeString(reqTo);

    function parseTimeString(timeString) {
      timeString = timeString.toLowerCase();
      const [time, period] = timeString.split(" ");
      const [hours, minutes] = timeString.split(":");
      let hours24 = parseInt(hours);

      if (period === "pm" && hours24 !== 12) hours24 += 12;
      else if (period === "am" && hours24 === 12) hours24 = 0;

      return hours24 * 60 + parseInt(minutes);
    }

    const durationInMin =
      toTime < fromTime ? toTime + 1440 - fromTime : toTime - fromTime;
    const totalCost = durationInMin * costPerMin;

    return res.json({ totalCost });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while calculating the cost" });
  }
});

module.exports = authRouter;
