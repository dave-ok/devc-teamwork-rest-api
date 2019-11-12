import express from 'express';
// import cors from 'cors';
import v1Router from './v1/routes';

const app = express();

// set up CORS
// app.use(cors);

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

export default app;
