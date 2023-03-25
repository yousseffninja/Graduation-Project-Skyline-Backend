// const sharp = require('sharp');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const sharp = require('sharp');
// const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.uploadTourCover = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  
  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: `/${tour.name}/${tour.name}-cover`,
    folder: 'tours',
    resource_type: 'image',
  });
  await Tour.findByIdAndUpdate(req.params.id, {
    imageCover: {
      userPhoto: result.secure_url,
      cloudinaryId: result.public_id,
    },
  });
  res.status(201).json({
    status: 'success',
  });
})

exports.uploadTourImages = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  const images = tour.images
  let pictureFiles = req.files;
  pictureFiles.map(async (picture, i) => {

    const result = await cloudinary.uploader.upload(picture.path, {
      public_id: `/${tour.name}/tour-${tour.name}-${Date.now()}-image-${i}`,
      folder: 'tours',
      resource_type: 'image'
    })
    images.push({
      tourPhoto: result.secure_url,
      cloudinaryId: result.public_id,
    })
    await Tour.findByIdAndUpdate(req.params.id, {
      images: images
    });
  });

  res.status(201).json({
    status: 'success',

  });
});

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

