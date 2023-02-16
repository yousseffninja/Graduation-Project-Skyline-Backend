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

router.patch('/uploadeMyPhoto', upload.single('image') , userController.uploadPersonalPhoto);

router.post('/phone/send-otp', twilio.sendOTP);
router.post('/phone/verify-otp', twilio.verifyOTP);

module.exports = router;