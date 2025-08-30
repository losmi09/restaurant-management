import express from 'express';
import * as tableController from '../controllers/tableController.js';
import * as authController from '../controllers/authController.js';
import { router as reservationRouter } from './reservationRoutes.js';

export const router = express.Router();

router.use('/:tableId/reservations', reservationRouter);

router.use(authController.protect);

router
  .route('/')
  .get(tableController.getAllTables)
  .post(
    authController.restrictTo('admin', 'manager'),
    tableController.createTable
  );

router
  .route('/:id')
  .get(tableController.getTable)
  .patch(
    authController.restrictTo('admin', 'manager'),
    tableController.updateTable
  )
  .delete(
    authController.restrictTo('admin', 'manager'),
    tableController.deleteTable
  );
