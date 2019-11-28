import express from 'express';
import validateData from '../../../middleware/validateData';
import { addArticleCommentRule } from '../../../middleware/validationRules';
import articleCommentsCtrl from '../../../controllers/articleCommentsController';


const articleCommentsRouter = express.Router({ mergeParams: true });

articleCommentsRouter.post('/', addArticleCommentRule(), validateData, articleCommentsCtrl.addComment);
// articleCommentsRouter.post('/:commentId/flag', articleCommentsCtrl.flagComment);
// articleCommentsRouter.post('/:commentId/unflag', articleCommentsCtrl.unflagComment);
// articleCommentsRouter.delete('/:commentId', articleCommentsCtrl.deleteComment);

export default articleCommentsRouter;
