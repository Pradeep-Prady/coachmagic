const mongoose = require("mongoose");

const TieupSchema = new mongoose.Schema({
  // partnertype: String,
  partnername: String,
  partneremail: String,
  code: String,
  subscriptionyears: String,
  amountstatus: String,
  amount: Number,
  students: [
    {
      email: String,
      rollNo: String,
      used: Boolean,
    },
  ],
});

let TieUpschema = mongoose.model("tieup", TieupSchema);

module.exports = TieUpschema;
