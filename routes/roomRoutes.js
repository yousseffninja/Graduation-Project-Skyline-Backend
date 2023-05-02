const express = require('express');
const roomController = require('./../controllers/roomController');
const authController = require('./../controllers/authController');
const upload = require('../utils/multer');
const hotelController = require('../controllers/hotelController');

const router = express.Router();

router
  .route('/')
  .get(roomController.getAllRooms)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    roomController.createRoom
  );

router
  .route('/:id')
  .get(roomController.getRoom)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    roomController.updateRoom
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    roomController.deleteRoom
  )

router
  .post(
    '/uploadRoomImage/:id/:hotelId',
    upload.single('image'),
    authController.protect,
    authController.restrictTo('admin'),
    roomController.uploadRoomCover
  );

module.exports = router;