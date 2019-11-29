import express from 'express';
import validateData from '../../middleware/validateData';
import { createGifRule } from '../../middleware/validationRules';
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

gifsRouter.use('/:gifId/comments', gifCommentsRouter);

export default gifsRouter;
