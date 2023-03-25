const airplaneCompany = require('./../models/airplaneCompanyModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllAirplaneCompany = factory.getAll(airplaneCompany);
exports.getAirplaneCompany = factory.getOne(airplaneCompany);
exports.createAirplaneCompany = factory.createOne(airplaneCompany);
exports.updateAirplaneCompany= factory.updateOne(airplaneCompany);
exports.deleteAirplaneCompany = factory.deleteOne(airplaneCompany);