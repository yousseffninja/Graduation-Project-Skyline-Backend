const cloudinary = require('../utils/cloudinary');
const Hotel = require('./../models/hotelModel');
const Room = require('./../models/roomModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.uploadHotelCover = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)

  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${hotel.hotelName}/${hotel.hotelName}-cover`,
    folder: 'hotels',
    resource_type: 'image',
  });
  await Hotel.findByIdAndUpdate(req.params.id, {
    hotelPhoto: result.secure_url,
    cloudinaryId: result.public_id,
  });
  res.status(201).json({
    status: 'success',
  });
})

exports.uploadPhotosOfHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)

  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${hotel.hotelName}/${hotel.hotelName}-${Math.floor(100000 + Math.random() * 900000).toString()}-photo`,
    folder: 'hotels',
    resource_type: 'image',
  });
  await Hotel.findByIdAndUpdate(req.params.id, {
    $push: { "images":  result.secure_url },
  });
  res.status(201).json({
    status: 'success',
  });
})

exports.getRoomsOfHotels = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);
  const roomsIds = hotel.rooms;
  const Rooms = await Room.find({
    _id: {
      $in: roomsIds
    }
  });
  res.status(201).json({
    status: 'success',
    Rooms
  })
})

exports.getAllHotels = factory.getAll(Hotel);
exports.getHotel = factory.getOne(Hotel);
// exports.getHotel = catchAsync(async (req, res, next) => {
//   let hotel = Hotel.findById(req.params.id);
//   if (popOptions) query = query.populate(popOptions);
//   const doc = await query;
//
//   if (!doc) {
//     return next(new AppError('No document found with that ID', 404));
//   }
// })
exports.createHotel = factory.createOne(Hotel);
exports.updateHotel = factory.updateOne(Hotel);
exports.deleteHotel = factory.deleteOne(Hotel);