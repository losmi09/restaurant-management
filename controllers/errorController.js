import AppError from '../utils/appError.js';

const handleInvalidToken = () =>
  new AppError('Token is invalid. Please log in again', 401);

const handleCastError = err =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleValidationError = (err, req, res) => {
  const obj = {};
  Object.values(err.errors).map(el => (obj[el.path] = el.message));

  let errors = Object.values(err.errors).map(el => el.message);

  if (req.headers.accept.includes('text/html'))
    return res.render('signup', { pageTitle: 'Sign Up', error: errors[0] });

  return res.status(400).json({
    status: 'fail',
    validationErrors: obj,
  });
};

const handleDuplicateField = err =>
  new AppError(`This ${Object.keys(err.keyValue)[0]} is already in use`, 400);

const sendErrorDev = (err, res) => {
  const { statusCode, status, message, stack } = err;
  res.status(statusCode).json({
    status,
    message,
    error: err,
    stack,
  });
};

const sendErrorProd = (err, res) => {
  const { isOperational, statusCode, status, message } = err;
  if (isOperational)
    return res.status(statusCode).json({
      status,
      message,
    });
  res.status(500).json({
    status: 'error',
    message: 'Something Went Wrong!',
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (err.name === 'CastError') error = handleCastError(err);
    if (err.name === 'ValidationError')
      return handleValidationError(err, req, res);
    if (err.code === 11000) error = handleDuplicateField(err);
    if (
      err.name === 'JsonWebTokenError' ||
      err.message.startsWith(
        'Bad control character in string literal in JSON at position'
      ) ||
      err.message.startsWith('Unterminated string in JSON at position') ||
      err.message.startsWith('Unexpected token')
    )
      error = handleInvalidToken();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
