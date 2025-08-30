import mongoose from 'mongoose';
import Table from './tableModel.js';

const reservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  capacity: {
    type: Number,
    required: [true, 'Please enter a capacity'],
  },
  table: {
    type: mongoose.Schema.ObjectId,
    ref: 'Table',
  },
});

reservationSchema.pre('save', async function (next) {
  await Table.findByIdAndUpdate(
    this.table,
    { status: 'reserved' },
    { new: true }
  );

  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
