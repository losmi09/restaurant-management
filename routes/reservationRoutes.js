import express from 'express';
import * as reservationController from '../controllers/reservationController.js';
import * as authController from '../controllers/authController.js';

export const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reservationController.getAllReservations)
  .post(
    authController.restrictTo('customer'),
    reservationController.setIDsAndCheckForCapacity,
    reservationController.createReservation
  );

router
  .route('/:id')
  .get(reservationController.getReservation)
  .patch(
    authController.restrictTo('manager'),
    reservationController.updateReservation
  )
  .delete(
    reservationController.checkIfReservationBelongsToUser,
    reservationController.deleteReservation
  );
