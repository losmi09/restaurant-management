import Dish from '../models/dishModel.js';
import * as factory from './handlerFactory.js';

export const getAllDishes = factory.getAll(Dish);
export const getDish = factory.getOne(Dish, {
  path: 'reviews',
  select: '-__v',
});
export const createDish = factory.createOne(Dish);
export const updateDish = factory.updateOne(Dish);
export const deleteDish = factory.deleteOne(Dish);
