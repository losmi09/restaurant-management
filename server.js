import dotenv from 'dotenv/config';

process.on('uncaughtException', err => {
  console.log('UNHANDLED EXCEPTION 💥');
  console.log(err.name, err.message);
  process.exit(1);
});

import mongoose from 'mongoose';
import app from './app.js';

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

const port = process.env.PORT || 8000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}...`)
);

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION 💥');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
