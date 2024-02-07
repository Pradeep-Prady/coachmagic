const mongoose = require("mongoose");

// DB_LOCAL_URI=mongodb+srv://coachmagic:bR6uF3S0uWGevwf0@cluster0.mpf4b9r.mongodb.net/?retryWrites=true&w=majority


// DB_LOCAL_URI=mongodb+srv://coachmagic:875p433Uc7UUK1e2@cmcluster.qky8gah.mongodb.net/CoachMagic?retryWrites=true&w=majority


const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "/config.env") });

const uri = process.env.DB_LOCAL_URI;

const connectDatabase = () => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`Database connection established to ${con.connection.host}`);
    })
    .catch((err) => {
      console.log(`Database connection error: ${err}`);
    });
};


module.exports = connectDatabase;
