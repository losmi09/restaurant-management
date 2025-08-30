import express from 'express';
import * as orderController from '../controllers/orderController.js';
import * as authController from '../controllers/authController.js';

export const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(
    authController.restrictTo('customer'),
    orderController.checkIfDishesExist,
    orderController.checkForReservation,
    orderController.createOrder
  );

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(
    authController.restrictTo('manager'),
    orderController.cancelOrder,
    orderController.updateOrder
  )
  .delete(
    authController.restrictTo('manager'),
    orderController.cancelOrder,
    orderController.deleteOrder
  );
