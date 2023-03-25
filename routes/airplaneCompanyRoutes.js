const express = require('express');
const airplaneCompanyController = require('./../controllers/airplaneCompanyController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(airplaneCompanyController.getAllAirplaneCompany)

module.exports = router;