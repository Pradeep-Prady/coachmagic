const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");

dotenv.config({ path: path.join(__dirname, "config/config.env") });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const query = require("./routes/query");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const invite = require("./routes/invite");
const chat = require("./routes/chat");

app.use("/api/v1", auth);
app.use("/api/v1", admin);
app.use("/api/v1", query);
app.use("/api/v1", invite);
app.use("/api/v1", chat);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

app.use(errorMiddleware);
module.exports = app;

// Online MongoDB server configuration
// DB_LOCAL_URI=mongodb+srv://coachmagic:bR6uF3S0uWGevwf0@cluster0.mpf4b9r.mongodb.net/?retryWrites=true&w=majority