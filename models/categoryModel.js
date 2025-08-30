import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A category must have a description'],
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual('dishesCount', {
  ref: 'Dish',
  foreignField: 'category',
  localField: '_id',
  count: true,
});

categorySchema.virtual('dishes', {
  ref: 'Dish',
  foreignField: 'category',
  localField: '_id',
});

categorySchema.pre(/^find/, function (next) {
  this.populate('dishesCount');
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
