
import Article from '../models/article.model';
import responseHandler from '../../utils/responseHandler';
import CustomError from '../../utils/customError';

const articlesCtrl = {

  createArticle: async (req, res, next) => {
    try {
      const article = new Article();
      article.title = req.body.title;
      article.article = req.body.article;
      article.user_id = req.user.userId;
      await article.save();

      return responseHandler(res, 201, {
        message: 'Article succesfully posted',
        articleId: article.article_id,
        title: article.title,
        createdOn: article.created_on,
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('duplicate key') >= 0) {
        return next(new CustomError(409, 'Duplicate error: article already exists'));
      }

      return next(error);
    }
  },

  updateArticle: async (req, res, next) => {
    try {
      // get articleId from url params
      const { articleId } = req.params;

      // retrieve article from DB
      const article = await Article.getbyId(articleId);

      console.log(`article: ${JSON.stringify(article)}`);

      // if article not found raise error
      if (!article) {
        return next(new CustomError(404, 'Article not found'));
      }

      // if article does not belong to user return error
      if (article.user_id !== req.user.userId) {
        return next(new CustomError(404, 'Article not found among your own articles'));
      }

      article.title = req.body.title;
      article.article = req.body.article;
      article.user_id = req.user.userId;
      await article.save();

      return responseHandler(res, 200, {
        message: 'Article succesfully updated',
        article: article.article,
        title: article.title,
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Article not found'));
      }

      return next(error);
    }
  },
};

export default articlesCtrl;
