const cloudinary = require('../utils/cloudinary');
const Hotel = require('./../models/hotelModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.uploadHotelCover = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)

  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${hotel.name}/${hotel.name}-cover`,
    folder: 'hotels',
    resource_type: 'image',
  });
  await Hotel.findByIdAndUpdate(req.params.id, {
    imageCover: {
      hotelPhoto: result.secure_url,
      cloudinaryId: result.public_id,
    },
  });
  res.status(201).json({
    status: 'success',
  });
})


exports.getAllHotels = factory.getAll(Hotel);
exports.getHotel = factory.getOne(Hotel);
exports.createHotel = factory.createOne(Hotel);
exports.updateHotel = factory.updateOne(Hotel);
exports.deleteHotel = factory.deleteOne(Hotel);