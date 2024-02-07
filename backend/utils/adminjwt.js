const sendAdminToken = (adminUser, statusCode, res) => {
  // creating jwt token
  const cmat = adminUser.getJwtToken();

  // setting cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("cmat", cmat, options).json({
    success: true,
    cmat,
    adminUser,
  });
};

module.exports = sendAdminToken;
