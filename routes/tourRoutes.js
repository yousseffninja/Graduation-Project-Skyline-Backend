const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const upload = require('../utils/multer');
// const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .post(
    '/uploadTourImages/:id',
    upload.array('image'),
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages
  );

router
  .post(
    '/uploadTourCover/:id',
    upload.single('image'),
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourCover
  );

module.exports = router;
