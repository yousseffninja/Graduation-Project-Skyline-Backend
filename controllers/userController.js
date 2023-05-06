const User = require('./../models/userModel');
const Orders = require('./../models/orderHistory');
const Flight = require('./../models/flghtModel')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const cloudinary = require('../utils/cloudinary');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'username', 'phone', 'firstName', 'lastName', 'birthDate');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getHistoryOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const ordersIds = user.orders;
  const orders = await Orders.find({
    _id: {
      $in: ordersIds
    }
  })
  const flightIds = orders.map(e => e.flight)
  const flights = await Flight.find({
    _id: {
      $in: flightIds
    }
  })
  res.status(201).json({
    status: 'success',
    orders,
    flights
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.uploadPersonalPhoto = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${user.username}/${user.username}PersonalPhoto`,
    folder: 'users',
    resource_type: 'image',
  });
  const updatedUser =  await User.findByIdAndUpdate(req.user.id, {
    userPhoto: result.secure_url,
    cloudinaryId: result.public_id,
  });
  res.status(201).json({
    status: 'success',
    updatedUser
  });
});

exports.uploadFrontID = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${user.username}/ID/${user.username}FrontID`,
    folder: 'users',
    resource_type: 'image',
  });
  const updatedUser =  await User.findByIdAndUpdate(req.user.id, {
    frontIDPhoto: result.secure_url,
    cloudinaryIdIDFront: result.public_id,
  });
  res.status(201).json({
    status: 'success',
    updatedUser
  });
});

exports.uploadBackID = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${user.username}/ID/${user.username}BackID`,
    folder: 'users',
    resource_type: 'image',
  });
  const updatedUser =  await User.findByIdAndUpdate(req.user.id, {
    frontBackPhoto: result.secure_url,
    cloudinaryIdIDBack: result.public_id,
  });
  res.status(201).json({
    status: 'success',
    updatedUser
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
