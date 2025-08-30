import Review from '../models/reviewModel.js';
import Dish from '../models/dishModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';

export const setIDsAndCheckForDish = catchAsync(async (req, res, next) => {
  req.body.customer = req.user.id;
  req.body.dish = req.params.dishId;

  const dish = await Dish.findById(req.params.dishId);
  if (!dish) return next(new AppError('No dish found with that ID', 404));

  const customer = await User.findById(req.user.id).populate('orders');

  const orderedDish = customer.orders.find(order =>
    order.dishes.includes(req.params.dishId)
  );

  if (!orderedDish)
    return next(new AppError('You must order the dish before review it', 403));

  next();
});

export const checkIfReviewBelongsToUser = change =>
  catchAsync(async (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'manager') return next();

    const review = await Review.findById(req.params.id);

    if (!review) return next(new AppError('No review found with that ID', 404));

    if (review.customer.toString() !== req.user.id.toString())
      return next(new AppError(`You can only ${change} your reviews`, 403));

    next();
  });

export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
