import mongoose from 'mongoose';
import Dish from './dishModel.js';

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review can't be empty!"],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please enter your rating'],
    min: [1, 'Rating must be above or equal to 1'],
    max: [5, 'Rating must be bellow or equal to 5'],
  },
  dish: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dish',
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

reviewSchema.statics.calcAverageRating = async function (dishId) {
  const stats = await this.aggregate([
    {
      $match: { dish: dishId },
    },
    {
      $group: {
        _id: '$dish',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await Dish.findByIdAndUpdate(
    dishId,
    { averageRating: stats[0].averageRating },
    { new: true }
  );
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.dish);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
