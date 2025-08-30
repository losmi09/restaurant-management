import Category from '../models/categoryModel.js';
import * as factory from './handlerFactory.js';

export const getAllCategories = factory.getAll(Category);
export const getCategory = factory.getOne(Category);
export const getCategoryWithDishes = factory.getOne(Category, {
  path: 'dishes',
  select: '-__v',
});
export const createCategory = factory.createOne(Category);
export const updateCategory = factory.updateOne(Category);
export const deleteCategory = factory.deleteOne(Category);
