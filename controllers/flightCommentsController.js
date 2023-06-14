const FlightComment = require('./../models/flightsCommentsModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const appError = require('./../utils/appError');

exports.setFlightUserIds = (req, res, next) => {
  if (!req.body.flight) req.body.flight = req.params.flightId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllFlightComments = catchAsync(async (req, res, next) => {
  let filter = {};

  const features = new APIFeatures(FlightComment.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const comments = await features.query

  res.status(200).json({
    status: 'success',
    results: comments.length,
    comments
  });
});

exports.getFlightComment= factory.getOne(FlightComment);
exports.createFlightComment = factory.createOne(FlightComment);
exports.updateFlightComment = factory.updateOne(FlightComment);
exports.deleteFlightComment = factory.deleteOne(FlightComment);