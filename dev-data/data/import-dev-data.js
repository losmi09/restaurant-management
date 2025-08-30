import dotenv from 'dotenv/config';

process.on('uncaughtException', err => {
  console.log('UNHANDLED EXCEPTION 💥');
  console.log(err.name, err.message);
  process.exit(1);
});

import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import Dish from '../../models/dishModel.js';

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectingDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log('DB connected successfully');
  } catch (err) {
    console.error('Error while connecting DB 💥');
    process.exit(1);
  }
};

connectingDB();

const dishes = JSON.parse(readFileSync('./dev-data/data/dishes.json', 'utf-8'));

const importData = async () => {
  try {
    await Dish.create(dishes);
    console.log('Data successfully imported');
  } catch (err) {
    console.log('Error while importing data 💥');
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Dish.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log('Error while deleting data 💥');
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
