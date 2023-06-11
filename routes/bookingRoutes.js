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
  '/checkout-session/flights/:flightId/:seatID/:userID',
  // authController.protect,
  bookingController.payment
);

router.get(
  '/success/:flightId/:seatID/:userID',
  authController.protect,
  bookingController.flightBookingSuccess
)

router.get(
  '/redirect/:flightId/:seatID/:userID',
  bookingController.flightBookingSuccess
)

module.exports = router;