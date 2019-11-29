import express from 'express';
import validateData from '../../../middleware/validateData';
import gifCommentsCtrl from '../../../controllers/gifCommentsController';
import { addGifCommentRule } from '../../../middleware/validationRules';

const gifCommentsRouter = express.Router({ mergeParams: true });

gifCommentsRouter.post('/', addGifCommentRule(), validateData, gifCommentsCtrl.addComment);


export default gifCommentsRouter;
