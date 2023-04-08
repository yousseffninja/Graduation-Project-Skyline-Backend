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
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/verify/:token', authController.verifyEmail)

router.use(authController.protect);

router.patch('/uploadMyPhoto', upload.single('image') , userController.uploadPersonalPhoto);
router.patch('/uploadIDFront', upload.single('image') , userController.uploadFrontID);
router.patch('/uploadIDBack', upload.single('image') , userController.uploadBackID);

router.post('/phone/send-otp', twilio.sendOTP);
router.post('/phone/verify-otp', twilio.verifyOTP);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;