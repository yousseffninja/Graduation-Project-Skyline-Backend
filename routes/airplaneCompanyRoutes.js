const express = require('express');
const airplaneCompanyController = require('./../controllers/airplaneCompanyController');
const authController = require('./../controllers/authController');
const upload = require('../utils/multer');
const router = express.Router();

router
  .route('/')
  .get(airplaneCompanyController.getAllAirplaneCompany)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    airplaneCompanyController.createAirplaneCompany
  );

router
  .route('/:id')
  .get(airplaneCompanyController.getAirplaneCompany)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    airplaneCompanyController.updateAirplaneCompany
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    airplaneCompanyController.deleteAirplaneCompany
  );

router.patch(
  '/uploadPhoto/:id',
  upload.single('image'),
  authController.protect,
  authController.restrictTo('admin'),
  airplaneCompanyController.uploadPhoto
);

module.exports = router;