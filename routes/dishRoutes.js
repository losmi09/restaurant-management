import express from 'express';
import * as dishController from '../controllers/dishController.js';
import * as authController from '../controllers/authController.js';
import { router as reviewRouter } from './reviewRoutes.js';

export const router = express.Router();

router.use('/:dishId/reviews', reviewRouter);

router
  .route('/')
  .get(dishController.getAllDishes)
  .post(
    authController.protect,
    authController.restrictTo('manager'),
    dishController.createDish
  );

router.use(authController.protect);

router
  .route('/:id')
  .get(dishController.getDish)
  .patch(authController.restrictTo('manager'), dishController.updateDish)
  .delete(authController.restrictTo('manager'), dishController.deleteDish);
