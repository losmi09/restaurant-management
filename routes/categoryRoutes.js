import express from 'express';
import * as authController from '../controllers/authController.js';
import * as categoryController from '../controllers/categoryController.js';

export const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(authController.restrictTo('admin'), categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(authController.restrictTo('admin'), categoryController.updateCategory)
  .delete(
    authController.restrictTo('admin'),
    categoryController.deleteCategory
  );

router.get('/:id/dishes', categoryController.getCategoryWithDishes);
