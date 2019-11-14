import express from 'express';
import cors from 'cors';
import v1Router from './v1/routes';
import { dispatchError } from './utils/errorhandler';

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
app.all('*', (req, res) => {
  res.status(404).send('Oops! Resource not found');
});

// default error handler
app.use((err, req, res, next) => {
  dispatchError(err, res);
});

export default app;
