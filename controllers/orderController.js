import Order from '../models/orderModel.js';
import Dish from '../models/dishModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';

export const checkIfDishesExist = catchAsync(async (req, res, next) => {
  const pendingOrder = await Order.findOne({
    customer: req.user.id,
    status: 'pending',
  });

  if (pendingOrder)
    return next(new AppError('You already have an order pending', 400));

  req.body.customer = req.user.id;

  if (!req.body.dishes) return next(new AppError('Please add the dishes', 400));

  let dishes = await Promise.all(
    req.body.dishes.map(dish => Dish.findById(dish))
  );

  req.body.dishes = dishes.filter(dish => dish !== null).map(dish => dish._id);

  if (!req.body.quantity)
    req.body.quantity = Array.from({ length: req.body.dishes.length }, () => 1);

  next();
});

export const checkForReservation = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('reservations');
  if (user.reservations.length === 0)
    return next(new AppError('Please reservate the table first', 403));
  next();
});

export const cancelOrder = catchAsync(async (req, res, next) => {
  if (req.body.status === 'canceled' || req.method === 'DELETE') {
    const order = await Order.findById(req.params.id);

    if (!order) return next(new AppError('No order found with this ID', 404));

    order.totalPrice = order.preparationTime = 0;

    order.status = 'canceled';

    await order.save({ validateBeforeSave: false });

    await Promise.all(
      order.dishes.map(async (dish, i) => {
        await Dish.findByIdAndUpdate(
          dish.toString(),
          { $inc: { stock: order.quantity[i] } },
          { new: true, runValidators: true }
        );
      })
    );
  }

  next();
});

export const getAllOrders = factory.getAll(Order);
export const getOrder = factory.getOne(Order);
export const createOrder = factory.createOne(Order);
export const updateOrder = factory.updateOne(Order);
export const deleteOrder = factory.deleteOne(Order);
