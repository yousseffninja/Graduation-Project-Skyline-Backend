const express = require('express');
const passport = require('passport')

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const upload = require('../utils/multer');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.googleAuth)

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/verify/:token', authController.verifyEmail)

router.use(authController.protect);

router.patch('/uploadeMyPhoto', upload.single('image') , userController.uploadPersonalPhoto);

module.exports = router;