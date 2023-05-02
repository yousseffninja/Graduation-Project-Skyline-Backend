const cloudinary = require('../utils/cloudinary');
const Hotel = require('./../models/hotelModel');
const Room = require('./../models/roomModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.uploadRoomCover = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.hotelId)

  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${hotel.hotelName}/${hotel.hotelName}-room-cover`,
    folder: 'rooms',
    resource_type: 'image',
  });
  await Room.findByIdAndUpdate(req.params.id, {
    roomPhoto: result.secure_url,
    cloudinaryId: result.public_id,
  });
  res.status(201).json({
    status: 'success',
  });
})

exports.createRoom = catchAsync(async(req, res, next) => {
  const room = await Room.create(req.body);
  await Hotel.findByIdAndUpdate(req.body.hotelId, {
    $push: { "rooms": room.id }
  })
  res.status(201).json({
    status: 'success',
    room
  })
})

exports.getAllRooms = factory.getAll(Room);
exports.getRoom = factory.getOne(Room);
exports.updateRoom = factory.updateOne(Room);
exports.deleteRoom = factory.deleteOne(Room);