const catchAsync = require('./catchAsync');

const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const User = require('../models/userModel');

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { countryCode, phoneNumber } = req.body;
  const OTPRespone = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({
      to: `+${countryCode}${phoneNumber}`,
      channel: "sms"
    })
  res.status(201).json({
    status: 'success',
    message: `OTP send successfully: ${JSON.stringify(OTPRespone)}`
  })
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { countryCode, phoneNumber, otpCode } = req.body;
  const verifyResponse = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verificationChecks.create({
      to: `+${countryCode}${phoneNumber}`,
      code: otpCode,
    }).then(async () => {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return next(
          new AppError('You are not logged in! Please log in to get access.', 401)
        );
      }

      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      const currentUser = await User.findByIdAndUpdate(decoded.id, {
        phoneActive: true
      });
    });
  res.status(201).json({
    status: 'success',
    message: `OTP verified successfully: ${JSON.stringify(verifyResponse)}`,
  })
});