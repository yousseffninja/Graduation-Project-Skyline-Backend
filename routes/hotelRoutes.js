const express = require('express');
const hotelController = require('./../controllers/hotelController');
const authController = require('./../controllers/authController');
const upload = require('../utils/multer');

const router = express.Router();

router
  .route('/')
  .get(hotelController.getAllHotels)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    hotelController.createHotel
  );

router
  .route('/:id')
  .get(hotelController.getHotel)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    hotelController.updateHotel
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    hotelController.deleteHotel
  )

router
  .post(
    '/uploadHotelImage/:id',
    upload.single('image'),
    authController.protect,
    authController.restrictTo('admin'),
    hotelController.uploadHotelCover
  );

module.exports = router;
