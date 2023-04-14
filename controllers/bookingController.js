const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour = require('./../models/tourModel');
const Flight = require('./../models/flghtModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSessionTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        // images:
        price_data: {

          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: tour.name,
            description: tour.summary,
          }
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
  });

  res.status(200).json({
    status: 'success',
    session
  });
});

exports.getCheckoutSessionFlight = catchAsync(async (req, res, next) => {
  const flight = await Flight.findById(req.params.flightId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/flight`,
    customer_email: req.user.email,
    client_reference_id: req.params.flightId,
    line_items: [
      {
        // images:
        price_data: {

          currency: 'usd',
          unit_amount: flight.price * 100,
          product_data: {
            name: `${flight.from} To ${flight.to}`,
            // description: tour.summary,
          }
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
  });

  res.status(200).json({
    status: 'success',
    session
  })
});

