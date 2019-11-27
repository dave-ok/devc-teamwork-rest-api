import express from 'express';
import validateData from '../../middleware/validateData';
import { createUpdateArticleRule, deleteArticleRule } from '../../middleware/validationRules';
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
  deleteArticleRule(),
  validateData,
  articlesCtrl.deleteArticle,
);

export default articlesRouter;
