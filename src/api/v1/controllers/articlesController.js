
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
        message: 'Article succesfully created',
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
};

export default articlesCtrl;
