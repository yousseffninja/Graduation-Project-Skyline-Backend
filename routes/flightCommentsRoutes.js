const express = require('express');
const flightCommentsController = require('./../controllers/flightCommentsController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(flightCommentsController.getAllFlightComments)
  .post(
    authController.restrictTo('user', 'admin'),
    flightCommentsController.setFlightUserIds,
    flightCommentsController.createFlightComment
  );

router
  .route('/:id')
  .get(flightCommentsController.getFlightComment)
  .patch(
    authController.restrictTo('user', 'admin'),
    flightCommentsController.updateFlightComment
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    flightCommentsController.deleteFlightComment
  );

module.exports = router;