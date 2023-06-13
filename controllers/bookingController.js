const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const axios = require('axios');
const Tour = require('./../models/tourModel');
const Flight = require('./../models/flghtModel');
const Orders = require('./../models/orderHistory');
const Users = require('./../models/userModel');
const Ticket = require('./../models/ticketModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const mongoose = require('mongoose');

const htmlSuccess = "<!DOCTYPE html>\n" +
  "<html>\n" +
  "<head>\n" +
  "\t<title>Payment Success</title>\n" +
  "\t<style>\n" +
  "\t\tbody {\n" +
  "\t\t\tfont-family: Arial, sans-serif;\n" +
  "\t\t\tbackground-color: #f2f2f2;\n" +
  "\t\t}\n" +
  "\t\th1 {\n" +
  "\t\t\tcolor: #008000;\n" +
  "\t\t\tfont-size: 36px;\n" +
  "\t\t\ttext-align: center;\n" +
  "\t\t\tmargin-top: 50px;\n" +
  "\t\t}\n" +
  "\t\tp {\n" +
  "\t\t\tfont-size: 24px;\n" +
  "\t\t\ttext-align: center;\n" +
  "\t\t\tmargin-top: 20px;\n" +
  "\t\t}\n" +
  "\t</style>\n" +
  "</head>\n" +
  "<body>\n" +
  "\t<h1>Payment Successful!</h1>\n" +
  "\t<p>Thank you for your payment.</p>\n" +
  "</body>\n" +
  "</html>\n";

async function checkSeatAvailablity(flightId, seatId) {
  const flight = await Flight.findById(flightId);
  const seats = flight.Seats

  for (const row of Object.values(seats)) {
    for (const seat of row) {
      if (seat.id === seatId) {
        return !seat.empty;
      }
    }
  }
  return false;
}

async function generatePaymobToken (){
  const requestData = {
    "api_key": process.env.PAYMOB_API_KEY
  }

  const response = await axios.post(process.env.PAYMOB_URL, requestData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data.token;
}

async function generatePaymentId (paymobToken, price, name){
  const requestData = {
    "auth_token": paymobToken,
    "delivery_needed": "false",
    "amount_cents": `${price * 100}`,
    "currency": "EGP",
    "items": [
      {
        "name": name,
        "amount_cents": price,
        "quantity": "1"
      }
    ]
  }

  const responseData = await axios.post(process.env.PAYMOB_REGISTRATION_URL, requestData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return responseData.data
}

async function generatePaymentIdRoundTripe(paymobToken, departureflightNo, departureflightPrice, arrivalflightNo, arrivalflightPrice){
  const requestData = {
    "auth_token": paymobToken,
    "delivery_needed": "false",
    "amount_cents": `${(departureflightPrice + arrivalflightPrice) * 100}`,
    "currency": "EGP",
    "items": [
      {
        "name": departureflightNo,
        "amount_cents": departureflightPrice,
        "quantity": "1"
      },
      {
        "name": arrivalflightNo,
        "amount_cents": arrivalflightPrice,
        "quantity": "1"
      },
    ]
  }

  const responseData = await axios.post(process.env.PAYMOB_REGISTRATION_URL, requestData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return responseData.data
}

async function generatePaymentToken (paymobToken, price, id){
  const paymentJSON = {
    "auth_token": paymobToken,
    "amount_cents": `${price * 100}`,
    "expiration": 360000,
    "order_id": id,
    "billing_data": {
      "apartment": "803",
      "email": "claudette09@exa.com",
      "floor": "42",
      "first_name": "Clifford",
      "street": "Ethan Land",
      "building": "8028",
      "phone_number": "+86(8)9135210487",
      "shipping_method": "PKG",
      "postal_code": "01898",
      "city": "Jaskolskiburgh",
      "country": "CR",
      "last_name": "Nicolas",
      "state": "Utah"
    },
    "currency": "EGP",
    "integration_id": process.env.PAYMOB_INTEGRATION_ID,
  }

  const response = await axios.post(process.env.PAYMOB_PAYMENT_KEY_REQUEST_URL, paymentJSON, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data.token
}

exports.payment = catchAsync(async (req, res, next) => {
  const { flightId, seatId, userId } = req.params;

  const flight = await Flight.findById(flightId);

  const paymobToken = await generatePaymobToken()
  const flightNo = flight.flightNo;
  const flightPrice = flight.price;

  if (!paymobToken) {
    return next(new AppError("Payment Failed !", 402));
  }

  const id = await generatePaymentId(paymobToken, flightPrice, flightNo);
  console.log(id)

  if (!id) {
    return next(new AppError("Payment Failed !", 402));
  }

  const data = await generatePaymentToken(paymobToken, flightPrice, id.id)

  if (!data) {
    return next(new AppError("Payment Failed !", 402));
  }

  if (!checkSeatAvailablity(flightId, seatId, userId)) {
    return next(new AppError("Flight Seat is not available"));
  }

  await Ticket.create({
    price: flight.price,
    flight: [flightId],
    type: 'one-way',
    seatId: seatId,
    user: userId,
    orderId: id.merchant.id,
    paymentStatus: false,
})

  res.redirect(`https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${data}`)
})

exports.paymentRoundTrip = catchAsync(async (req, res, next) => {
  const { departureFlightId, arrivalFlightId, seatId, userId } = req.body;

  const departureFlight = await Flight.findById(departureFlightId);
  const arrivalFlight = await Flight.findById(arrivalFlightId);

  const paymobToken = await generatePaymobToken()
  const departureflightNo = departureFlight.flightNo;
  const departureflightPrice = departureFlight.price;
  const arrivalflightNo = arrivalFlight.flightNo;
  const arrivalflightPrice = arrivalFlight.price;

  if (!paymobToken) {
    return next(new AppError("Payment Failed !", 402));
  }

  const id = await generatePaymentIdRoundTripe(paymobToken, departureflightNo, departureflightPrice, arrivalflightNo, arrivalflightPrice);
  console.log(id)

  if (!id) {
    return next(new AppError("Payment Failed !", 402));
  }

  const data = await generatePaymentToken(paymobToken, (departureflightPrice + arrivalflightPrice), id.id)

  if (!data) {
    return next(new AppError("Payment Failed !", 402));
  }

  if (!checkSeatAvailablity(departureFlightId, seatId, userId)) {
    return next(new AppError("Flight Seat is not available"));
  }

  if (!checkSeatAvailablity(arrivalFlightId, seatId, userId)) {
    return next(new AppError("Flight Seat is not available"));
  }

  await Ticket.create({
    price: (departureflightPrice + arrivalflightPrice),
    flight: [departureFlightId, arrivalFlightId],
    type: 'round-trip',
    seatId: seatId,
    user: userId,
    orderId: id.merchant.id,
    paymentStatus: false,
  })

  console.log(`https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${data}`)
  res.redirect(`https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${data}`)
})

exports.paymentSuccess = catchAsync(async (req, res, next) => {
  const { profile_id } = req.query;
  console.log(profile_id);
  const ticket = await Ticket.find({ orderId: profile_id });
  const seatId = ticket[0].seatId;
  const flightId = ticket[0].flight;
  const userId = ticket[0].user;
  const flight = await Flight.findById(flightId);
  console.log(ticket)
  const seats = flight.Seats
  for (const row of Object.values(seats)) {
    for (const seat of row) {
      if (seat.id === seatId) {
        seat.empty = false;
      }
    }
  }
  await Flight.findByIdAndUpdate(flightId, {
    Seats: seats
  });

  const newTicket = await Ticket.findOneAndUpdate({ orderId: profile_id }, {
    paymentStatus: true,
  })

  await Users.findByIdAndUpdate(userId, {
    $push: { "tickets": newTicket.id }
  });

  res.status(201).type("html").send(htmlSuccess);
});

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