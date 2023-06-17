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
  '/checkout-session/flights/:flightId/:seatId/:userId',
  // authController.protect,
  bookingController.payment
);

router.post(
  '/round-trip/flights/',
  // authController.protect,
  bookingController.paymentRoundTrip
);
router.post(
  '/multi-destination/flights/',
  // authController.protect,
  bookingController.paymentmuliDestination
);

router.post(
  '/hotel/rooms',
  bookingController.paymentHotel
)

router.get(
  '/success/',
  bookingController.paymentSuccess
)

// router.get(
//   '/success/:flightId/:seatID/:userID',
//   authController.protect,
//   bookingController.flightBookingSuccess
// )

module.exports = router;