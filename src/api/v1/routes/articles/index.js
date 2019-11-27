import express from 'express';
import validateData from '../../middleware/validateData';
import { createUpdateArticleRule, singleArticleRule } from '../../middleware/validationRules';
import articlesCtrl from '../../controllers/articlesController';

const articlesRouter = express.Router();

articlesRouter.get('/', (req, res) => {
  res.send('articles default route');
});

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

export default articlesRouter;
