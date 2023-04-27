const express = require('express');
const passport = require('passport')

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const upload = require('../utils/multer');
const twilio = require('./../utils/twilio-sms');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.googleOrGoogleAuth)

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), authController.googleOrGoogleAuth)

router.post('/forgotPassword', authController.forgotPassword);
router.post('/forgotPasswordSMS', twilio.sendOTPForget);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/resetPasswordSMS/', twilio.verifyOTPReset);
router.patch('/sendEmailVerification', authController.sendEmailVerification)
router.patch('/verify/:token', authController.verifyEmail)

router.patch(
  '/uploadMyPhoto',
  upload.single('image'),
  authController.protect,
  userController.uploadPersonalPhoto
);

router.patch(
  '/uploadIDFront',
  upload.single('image'),
  authController.protect,
  userController.uploadFrontID
);

router.patch(
  '/uploadIDBack',
  upload.single('image'),
  authController.protect,
  userController.uploadBackID
);

router.post(
  '/phone/send-otp',
  authController.protect,
  twilio.sendOTP
);

router.post(
  '/phone/verify-otp',
  authController.protect,
  twilio.verifyOTP
);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  userController.getMe,
  userController.getUser
);

router.patch(
  '/updateMe',
  authController.protect,
  userController.updateMe
);
router.delete(
  '/deleteMe',
  authController.protect,
  userController.deleteMe
);



router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers)

router
  .route('/:id')
  .get(authController.restrictTo('admin'), userController.getUser)
  .patch(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;