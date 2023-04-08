const airplaneCompany = require('./../models/airplaneCompanyModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const cloudinary = require('../utils/cloudinary');

exports.uploadPhoto = catchAsync(async(req, res, next) => {
  const airplanCompany = await airplaneCompany.findById(req.params.id)
  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${airplanCompany.airplaneName}/${airplanCompany.airplaneName}Photo`,
    folder: 'airplane_comapnies',
    resource_type: 'image',
  });
  const updatedairplanCompany = await airplaneCompany.findByIdAndUpdate(req.params.id, {
    airplaneCompanyPhoto: result.secure_url,
    cloudinaryIdAirplane: result.public_id,
  });
  res.status(201).json({
    status: 'success',
    updatedairplanCompany
  });
})

exports.getAllAirplaneCompany = factory.getAll(airplaneCompany);
exports.getAirplaneCompany = factory.getOne(airplaneCompany);
exports.createAirplaneCompany = factory.createOne(airplaneCompany);
exports.updateAirplaneCompany= factory.updateOne(airplaneCompany);
exports.deleteAirplaneCompany = factory.deleteOne(airplaneCompany);