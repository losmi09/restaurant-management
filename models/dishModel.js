import mongoose from 'mongoose';
import slugify from 'slugify';

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A dish must have a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A dish must have a description'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A dish must have a price'],
    },
    stock: {
      type: Number,
      required: [true, 'A dish must have a stock quantity'],
      min: [0, 'The stock quantity must be above 0'],
    },
    ingredients: [String],
    extras: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number,
      required: [true, 'Please provide a preparation time'],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

dishSchema.virtual('reviewsCount', {
  ref: 'Review',
  foreignField: 'dish',
  localField: '_id',
  count: true,
});

dishSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'dish',
  localField: '_id',
});

dishSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

dishSchema.pre(/^find/, function (next) {
  this.populate('reviewsCount');
  next();
});

const Dish = mongoose.model('Dish', dishSchema);

export default Dish;
