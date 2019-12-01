import express from 'express';
import validateData from '../../middleware/validateData';
import { createUpdateArticleRule, singleArticleRule } from '../../middleware/validationRules';
import articlesCtrl from '../../controllers/articlesController';
import articleCommentsRouter from './comments';

const articlesRouter = express.Router();

articlesRouter.get('/', articlesCtrl.viewAllArticles);

articlesRouter.post(
  '/',
  createUpdateArticleRule(),
  validateData,
  articlesCtrl.createArticle,
);

articlesRouter.patch(
  '/:articleId',
  createUpdateArticleRule(),
  validateData,
  articlesCtrl.updateArticle,
);

articlesRouter.delete(
  '/:articleId',
  singleArticleRule(),
  validateData,
  articlesCtrl.deleteArticle,
);

articlesRouter.get(
  '/:articleId',
  singleArticleRule(),
  validateData,
  articlesCtrl.viewArticle,
);

articlesRouter.post(
  '/:articleId/flag',
  singleArticleRule(),
  validateData,
  articlesCtrl.flagArticle,
);

articlesRouter.post(
  '/:articleId/unflag',
  singleArticleRule(),
  validateData,
  articlesCtrl.unflagArticle,
);


articlesRouter.use('/:articleId/comments', articleCommentsRouter);

export default articlesRouter;
