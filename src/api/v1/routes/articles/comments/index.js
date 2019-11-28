import express from 'express';
import articlesCtrl from '../../../controllers/articlesController';
import validateData from '../../../middleware/validateData';
import { addArticleCommentRule } from '../../../middleware/validationRules';

const articleCommentsRouter = express.Router();

articleCommentsRouter.post('/', addArticleCommentRule(), validateData, articlesCtrl.addComment);
// articleCommentsRouter.post('/:commentId/flag', articlesCtrl.flagComment);
// articleCommentsRouter.post('/:commentId/unflag', articlesCtrl.unflagComment);
// articleCommentsRouter.delete('/:commentId', articlesCtrl.deleteComment);

export default articleCommentsRouter;
