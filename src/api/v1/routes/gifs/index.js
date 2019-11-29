import express from 'express';
import validateData from '../../middleware/validateData';
import { createGifRule, singleGifRule } from '../../middleware/validationRules';
import gifsCtrl from '../../controllers/gifsController';
import cloudinaryUploader from '../../middleware/cloudinaryUploader';
import gifCommentsRouter from './comments';

const gifsRouter = express.Router();

gifsRouter.post(
  '/',
  cloudinaryUploader('image'),
  createGifRule(),
  validateData,
  gifsCtrl.createGif,
);

gifsRouter.delete(
  '/:gifId',
  singleGifRule(),
  validateData,
  gifsCtrl.deleteGif,
);

gifsRouter.get(
  '/:gifId',
  singleGifRule(),
  validateData,
  gifsCtrl.viewGif,
);

gifsRouter.use('/:gifId/comments', gifCommentsRouter);

export default gifsRouter;
