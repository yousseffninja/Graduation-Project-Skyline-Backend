const Flight = require('./../models/flghtModel');
const AirplaneCompany = require('./../models/airplaneCompanyModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const airplaneCompany = require('../models/airplaneCompanyModel');

exports.CreateFlight = catchAsync(async (req, res, next) => {
  const flight = await Flight.create(req.body);
  const airplane = await AirplaneCompany.findByIdAndUpdate(flight.airplaneCompany, {
    $push: { "flights": flight.id },
  });

  res.status(201).json({
    status: 'success',
    data: {
      flight,
      airplane
    }
  });
});

exports.getAllFlight = factory.getAll(Flight);
exports.getFlight = factory.getOne(Flight);
exports.updateFlight= factory.updateOne(Flight);
exports.deleteFlight= factory.deleteOne(Flight);