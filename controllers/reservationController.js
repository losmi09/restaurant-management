import Reservation from '../models/reservationModel.js';
import Table from '../models/tableModel.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

export const setIDsAndCheckForCapacity = catchAsync(async (req, res, next) => {
  req.body.customer = req.user.id;
  req.body.table = req.params.tableId;

  const table = await Table.findById(req.params.tableId);

  if (req.body.capacity > table.capacity)
    return next(
      new AppError(
        `This table can only accomodate up to ${table.capacity} guests`,
        400
      )
    );

  next();
});

export const checkIfReservationBelongsToUser = catchAsync(
  async (req, res, next) => {
    if (req.user.role === 'manager') return next();

    const currentUser = await User.findById(req.user.id).populate(
      'reservations'
    );

    const reservation = currentUser.reservations.find(
      reservation => reservation._id.toString() === req.params.id
    );

    if (!reservation)
      return next(new AppError('You can only delete your reservations', 403));

    next();
  }
);

export const getAllReservations = factory.getAll(Reservation);
export const getReservation = factory.getOne(Reservation);
export const createReservation = factory.createOne(Reservation);
export const updateReservation = factory.updateOne(Reservation);
export const deleteReservation = factory.deleteOne(Reservation);
