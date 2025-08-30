import Table from '../models/tableModel.js';
import * as factory from './handlerFactory.js';

export const getAllTables = factory.getAll(Table);
export const getTable = factory.getOne(Table, {
  path: 'reservations',
  select: '-__v',
});
export const createTable = factory.createOne(Table);
export const updateTable = factory.updateOne(Table);
export const deleteTable = factory.deleteOne(Table);
