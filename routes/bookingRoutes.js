const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/tours/:tourId',
  authController.protect,
  bookingController.getCheckoutSessionTour
);

router.get(
  '/checkout-session/flights/:flightId',
  authController.protect,
  bookingController.getCheckoutSessionFlight
);

module.exports = router;