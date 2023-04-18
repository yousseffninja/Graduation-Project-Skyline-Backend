const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour = require('./../models/tourModel');
const Flight = require('./../models/flghtModel');
const catchAsync = require('./../utils/catchAsync');
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
    success_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/redirect/${req.params.flightId}/${req.params.seatID}`,
    cancel_url: `${req.protocol}://${req.get('host')}/flight`,
    customer_email: req.user.email,
    client_reference_id: req.params.flightId,
    line_items: [
      {
        price_data: {

          currency: 'usd',
          unit_amount: flight.price * 100,
          product_data: {
            name: `${flight.from} To ${flight.to}`,
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

exports.flightBookingSuccess = catchAsync(async (req, res, next) => {
  const flight = await Flight.findById(req.params.flightId)
  const seatID = req.params.seatID
  if (seatID.charAt(0) === "A" || seatID.charAt(0) === "B"){
    const index = (seatID.charCodeAt(0) - 65) * parseInt(seatID.charAt(1));
    if (flight.Seats.Row1[index].empty){
      flight.Seats.Row1[index] = {
        id: seatID,
        empty: false,
        selected: true,
        userId: req.user.id,
      }

      const obj = flight.Seats
      flight.Seats = obj;
      await Flight.findByIdAndUpdate(req.params.flightId, {
        Seats: obj
      })
      await flight.save({ validateBeforeSave: false });
    } else {
      next(
        new AppError('This seat is already booked!', 301)
      );
    }
  } else {
    const index = (seatID.charCodeAt(0) - 67) * parseInt(seatID.charAt(1));

    if (flight.Seats.Row2[index].empty){
      flight.Seats.Row2[index] = {
        id: seatID,
        empty: false,
        selected: true,
        userId: req.user.id,
      }
      const obj = flight.Seats
      flight.Seats = obj;
      await Flight.findByIdAndUpdate(req.params.flightId, {
        Seats: obj
      })
      await flight.save({ validateBeforeSave: false });
    } else {
      next(
        new AppError('This seat is already booked!', 301)
      );
    }
  }
  await flight.save({ validateBeforeSave: false });
  res.status(201).json({
    status: 'Success',
    message: 'booking successful !'
  })
});

exports.redirectToMobile = catchAsync(async (req, res, next) => {
  res.redirect(`exp://192.168.1.4:19000/--/Home?flightId=${req.params.flightId}&seatID=${req.params.seatID}`)
})

