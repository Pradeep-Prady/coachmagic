const catchAsyncError = require("../middlewares/catchAsyncError");
const VerifyUser = require("../models/verifyUser");
const User = require("../models/userModel");

const {
  activateAccountTemplate,
  accountActivatedTemplate,
} = require("../html/templates");

const ErrorHandler = require("../utils/errorHandler");

const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");

function generateToken(email) {
  const token = jwt.sign(email, process.env.signup_Secret_Token);
  return token;
}

exports.verifyUser = catchAsyncError(async (req, res, next) => {
  const { name, userId, email, password, confirmpassword } = req.body;

  if (confirmpassword !== password) {
    return next(new ErrorHandler(" Password Not Match", 400));
  }

  const registerCredentials = await User.findOne({ email: email });

  if (registerCredentials) {
    return next(new ErrorHandler("User Already Exists", 400));
  }

  const checkId = await User.findOne({ userId: userId });

  if (checkId) {
    return next(new ErrorHandler("User Id Already Exists", 400));
  }

  const token = generateToken(email);
  const user = await VerifyUser.create({
    name,
    userId,
    email,
    password,
    token: token,
  });

  let BASE_URL = process.env.FRONTEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  const activationLink = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/signin/${token}`;

  // const staticHtml = ReactSnapshot.renderToString(
  //   <SignupSuccess {...{ name, activationLink }} />
  // );

  await user.save();
  sendEmail({
    email: email,
    subject: "Coach Magic Email Verification Request",
    html: activateAccountTemplate(name, activationLink),
  });

  res.status(200).json({
    success: true,
    user,
  });
});

async function InsertSignUpUser(token, req, res, next) {
  try {
    const verifyUser = await VerifyUser.findOne({ token: token });
    if (!verifyUser) {
      // next(new ErrorHandler("User Not available", 400));

      return `
        <html>
          <head>
            <style>
              h4 {
                font-size: 24px;
                color: #333;
              }
              h3 {
                font-size: 20px;
                color: #007BFF;
              }
              p {
                font-size: 16px;
                color: #555;
              }
              .button {
                background-color: #007BFF;
               color: black;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <h4>Hi there,</h4>
            <h3>Your account has been Already activated or Old Link!</h3>
             
            <a href="/signup" class="button">Make New Account</a>

           
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Best regards,</p>
            <p>The Coach Magic Team</p>
          </body>
        </html>
      `;
    }

    if (verifyUser) {
      const user = new User({
        name: verifyUser.name,
        userId: verifyUser.userId,
        email: verifyUser.email,
        password: verifyUser.password,
      });

      await user.save();

      if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get("host")}`;
      }
      const activationLink = `${BASE_URL}/signin/`;
      sendEmail({
        email: verifyUser.email,
        subject: "Your Coach Magic Account is Activated",
        html: accountActivatedTemplate(verifyUser.name),
      });

      await verifyUser.deleteOne({ token: token });

      return `<!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Signup Success</title>
         <style>
           /* Add your reset or normalize styles here if needed */
     
           body {
             margin: 0;
             font-family: "Helvetica", "Arial", sans-serif;
             height: 100vh;
           }
     
           .w-full {
             width: 100%;
           }
     
           .h-auto {
             height: 100%;
           }
     
           .sm:h-auto {
             height: 100%;
           }
     
           .md:h-screen {
             height: 100%;
           }
     
           .bg-blue-300 {
             background-color: #b3ddff;
           }
     
           .py-3 {
             padding-top: 0.75rem;
             padding-bottom: 0.75rem;
           }
     
           .px-2 {
             padding-left: 0.5rem;
             padding-right: 0.5rem;
           }
     
           .flex {
             display: flex;
           }
     
           .items-center {
             align-items: center;
           }
     
           .justify-center {
             justify-content: center;
           }
     
           .sm:py-7 {
             padding-top: 1.75rem;
             padding-bottom: 1.75rem;
           }
     
           .sm:px-24 {
             padding-left: 4.5rem;
             padding-right: 4.5rem;
           }
     
           .md:px-40 {
             padding-left: 10rem;
             padding-right: 10rem;
           }
     
           .glass {
             background-color: white; /* or any color you want for the glass effect */
             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
             border-radius: 8px;
           }
     
           .md:w-8/12 {
             width: 66.6666667%;
           }
     
           .text-center {
             text-align: center;
           }
     
           .relative {
             position: relative;
           }
     
           .btn {
             padding: 10px 20px;
             text-align: center;
             text-decoration: none;
             display: inline-block;
             font-size: 16px;
             border-radius: 4px;
           }
           .p-7 {
             padding: 1.75rem;
           }
     
           .text-2xl {
             font-size: 1.5rem;
           }
     
           .font-bold {
             font-weight: bold;
           }
     
           .mb-4 {
             margin-bottom: 1rem;
           }
     
           .mb-6 {
             margin-bottom: 1.5rem;
           }
     
           .font-semibold {
             font-weight: 600;
           }
     
           a {
             color: inherit;
             text-decoration: underline;
           }
     
           a:hover {
             color: #007bff;
             text-decoration: none;
           }
     
           .flex {
             display: flex;
           }
     
           .items-center {
             align-items: center;
           }
     
           .justify-center {
             justify-content: center;
           }
     
           .bg-black {
             background-color: #000;
           }
     
           .text-white {
             color: #fff;
           }
     
           .px-5 {
             padding-left: 1;
           }
         </style>
       </head>
       <body>
         <div
           class="w-full h-auto md:h-screen bg-blue-300 flex items-center justify-center"
         >
           <div class="glass md:w-8/12 text-center relative p-7">
             <div>
               <h2 class="text-2xl font-bold mb-4">Hello ${verifyUser.name},</h2>
               <p class="mb-6">
                 Great news! Your
                 <span class="font-semibold">Coach Magic</span> account is now
                 officially activated.
               </p>
               <p class="mb-6">
                 Thanks for choosing Coach Magic. We're excited to have you on board.
                 To get started, just
                 <a href="/signin" class="font-semibold">log in</a> to your account.
               </p>
               <div class="flex mb-6 items-center justify-center">
                 <a
                   href="/signin"
                   class="bg-black text-white px-5 py-2 rounded-sm font-semibold btn"
                   >Login</a
                 >
               </div>
               <p class="mb-4">
                 Your personalized dashboard is ready with tools and resources to
                 support your coaching experience.
               </p>
               <p class="mb-6">
                 Explore the platform, connect with fellow coaches, and unlock the
                 full potential of Coach Magic.
               </p>
               <p class="mb-2 text-14">
                 If you have any questions or need assistance, our support team is
                 here for you. Don't hesitate to reach out.
               </p>
               <p class="text-14">
                 Best regards from all of us at Coach Magic. We're here to support
                 you every step of the way!
               </p>
               <div class="my-5 py-2">
                 <hr />
                 <p>Warm regards,</p>
                 <p>The <span class="font-semibold">Coach Magic</span> Team</p>
               </div>
             </div>
           </div>
         </div>
       </body>
     </html>
     `;
    }

    return `
  <html>
    <head>
      <style>
        h4 {
          font-size: 24px;
          color: #333;
        }
        h3 {
          font-size: 20px;
          color: #FF0000;
        }
        p {
          font-size: 16px;
          color: #555;
        }
      </style>
    </head>
    <body>
      <h4>Hi there,</h4>
      <h2>Welcome to Errors</h2>
      <h3>Registration Failed on <strong>Coach Magic</strong></h3>
      <p>The registration link has expired or an error occurred during the registration process.</p>
      <p>Please double-check the registration link or contact our support team for assistance.</p>
      <p>Best regards,</p>
      <p>The Coach Magic Team</p>
    </body>
  </html>
`;
  } catch (err) {
    return `
    <html>
      <head>
        <style>
          h4 {
            font-size: 24px;
            color: #333;
          }
          h3 {
            font-size: 20px;
            color: #FF0000;
          }
          p {
            font-size: 16px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <h4>Hi there,</h4>

        <h2>${err}</h2>
        <h3>Registration Failed on <strong>Coach Magic</strong></h3>
        <p>The registration link has expired or an error occurred during the registration process.</p>
        <p>Please double-check the registration link or contact our support team for assistance.</p>
        <p>Best regards,</p>
        <p>The Coach Magic Team</p>
      </body>
    </html>
  `;
  }
}

exports.insertUser = catchAsyncError(async (req, res, next) => {
  try {
    const response = await InsertSignUpUser(req.params.token, req, res, next);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(`
     
  <html>
    <head>
      <style>
        h4 {
          font-size: 24px;
          color: #333;
        }
        h3 {
          font-size: 20px;
          color: #FF0000;
        }
        p {
          font-size: 16px;
          color: #555;
        }
      </style>
    </head>
    <body>
      <h4>Hi there,</h4>
      <h3>Registration Failed on <strong>Coach Magic</strong></h3>
      <p>The registration link has expired or an error occurred during the registration process.</p>
      <p>Please double-check the registration link or contact our support team for assistance.</p>
      <p>Best regards,</p>
      <p>The Coach Magic Team</p>
    </body>
  </html>


    `);
  }
});
