import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import * as authController from '../controllers/authController.js';

export const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('customer'),
    reviewController.setIDsAndCheckForDish,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    reviewController.checkIfReviewBelongsToUser('update'),
    reviewController.updateReview
  )
  .delete(
    reviewController.checkIfReviewBelongsToUser('delete'),
    reviewController.deleteReview
  );
