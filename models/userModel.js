import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      unique: true,
      validate: {
        validator: function (val) {
          return validator.isEmail(val);
        },
        message: 'Please enter a valid email',
      },
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      trim: true,
      minLength: [8, 'Password must be 8 characters or longer'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      trim: true,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: 'Passwords do not match',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    role: {
      type: String,
      enum: {
        values: ['customer', 'waiter', 'manager', 'admin'],
      },
      default: 'customer',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('ordersCount', {
  ref: 'Order',
  foreignField: 'customer',
  localField: '_id',
  count: true,
});

userSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'customer',
  localField: '_id',
});

userSchema.virtual('reservations', {
  ref: 'Reservation',
  foreignField: 'customer',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  if (!this.isNew) this.passwordChangedAt = new Date();

  next();
});

userSchema.pre(/^find/, function (next) {
  this.where({ active: { $ne: false } });
  this.populate('ordersCount');
  next();
});

userSchema.methods.comparePasswords = async function (
  password,
  hashedPassword
) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.methods.checkForPasswordChange = function (JWTTimestamp) {
  if (this.passwordChangedAt)
    return JWTTimestamp * 1000 < this.passwordChangedAt.getTime();

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
