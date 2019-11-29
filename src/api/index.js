import express from 'express';
import cors from 'cors';
import customEnv from 'custom-env';
import v1Router from './v1/routes';
import errorHandler from './utils/errorhandler';
import CustomError from './utils/customError';

customEnv.env(true);

// create express app
const app = express();

// set up CORS
app.use(cors());


// include middleware to enable json body parsing and nested objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// base uri response
app.get('/', (req, res) => {
  res.status(200).send('Go team!');
});

// router for api version 1
app.use('/api/v1', v1Router);

// routes not found go here
app.all('*', (req, res, next) => {
  const error = new CustomError(404, 'Oops! Resource not found');
  next(error);
});

// default error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default app;
