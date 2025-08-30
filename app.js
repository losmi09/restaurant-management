import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import qs from 'qs';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import { router as dishRouter } from './routes/dishRoutes.js';
import { router as userRouter } from './routes/userRoutes.js';
import { router as categoryRouter } from './routes/categoryRoutes.js';
import { router as orderRouter } from './routes/orderRoutes.js';
import { router as tableRouter } from './routes/tableRoutes.js';
import * as authController from './controllers/authController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

app.use(cors());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in one hour',
});

app.use('/api', limit);

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.set('query parser', str => qs.parse(str));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(xss());

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    ...Object.getOwnPropertyDescriptor(req, 'query'),
    value: req.query,
    writable: true,
  });

  next();
});

app.use(mongoSanitize());

app.use(
  hpp({
    whitelist: [
      'name',
      'description',
      'category',
      'price',
      'stock',
      'ingredients',
      'extras',
      'isAvailable',
      'isFeatured',
      'preparationTime',
      'averageRating',
      'createdAt',
      'updatedAt',
      'slug',
      'reviewsCount',
    ],
  })
);

app.use(compression());

app
  .route('/users/signup')
  .get((req, res) =>
    res.render('signup', { pageTitle: 'Sign Up', error: null })
  )
  .post(authController.signup);

app.use('/api/v1/dishes', dishRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/tables', tableRouter);

app.use((req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server!`;

  if (req.headers.accept.includes('text/html'))
    return res.render('404', { pageTitle: 'Not Found', message });

  next(new AppError(message, 404));
});

app.use(globalErrorHandler);

export default app;
