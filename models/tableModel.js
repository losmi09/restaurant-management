import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: [true, 'A table must have a number'],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'A table must have a capacity'],
    },
    status: {
      type: String,
      required: [true, 'A table must have a status'],
      enum: {
        values: ['available', 'reserved', 'occupied', 'out_of_service'],
      },
      default: 'available',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tableSchema.virtual('reservations', {
  ref: 'Reservation',
  foreignField: 'table',
  localField: '_id',
});

const Table = mongoose.model('Table', tableSchema);

export default Table;
