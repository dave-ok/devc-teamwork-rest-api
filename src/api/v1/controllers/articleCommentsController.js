import ArticleComment from '../models/articlecomment.model';
import responseHandler from '../../utils/responseHandler';
import CustomError from '../../utils/customError';

const articleCommentsCtrl = {
  addComment: async (req, res, next) => {
    try {
      // create comment on article
      const articleComment = new ArticleComment();
      articleComment.article_id = req.params.articleId;
      articleComment.user_id = req.user.userId;
      articleComment.comment = req.body.comment;
      await articleComment.save();

      // console.log(`article comment: ${JSON.stringify(articleComment)}`);

      return responseHandler(res, 201, {
        message: 'Comment successfully created',
        createdOn: articleComment.created_on,
        articleTitle: articleComment.title,
        article: articleComment.article,
        comment: articleComment.comment,
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

export default articleCommentsCtrl;
