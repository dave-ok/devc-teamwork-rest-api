import express from 'express';

const articlesRouter = express.Router();

articlesRouter.get('/', (req, res) => {
  res.send('articles default route');
});

export default articlesRouter;
