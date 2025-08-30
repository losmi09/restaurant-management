import mongoose from 'mongoose';
import Dish from './dishModel.js';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  dishes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Dish',
    },
  ],
  quantity: {
    type: [Number],
    required: [true, 'Please enter a quantity'],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  preparationTime: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'preparing', 'ready', 'canceled'],
    },
    default: 'pending',
  },
});

orderSchema.pre('save', async function (next) {
  if (this.status === 'canceled' && !this.isNew) return next();

  await this.populate('dishes');

  this.status = 'pending';

  this.dishes.forEach((dish, i) => {
    this.totalPrice += dish.price * this.quantity[i];
    this.preparationTime += dish.preparationTime * this.quantity[i];
  });

  await Promise.all(
    this.dishes.map(async (dish, i) => {
      await Dish.findByIdAndUpdate(
        dish,
        { $inc: { stock: -this.quantity[i] } },
        { new: true, runValidators: true }
      );
    })
  );

  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
