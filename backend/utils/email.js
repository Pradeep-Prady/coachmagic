const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (options) => {
  const transport = {
    service: "gmail",
    auth: {
      user: process.env.nodemailer_user,
      pass: process.env.nodemailer_pass,
    },
  };

  const transporter = nodemailer.createTransport(transport);

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = sendEmail;
