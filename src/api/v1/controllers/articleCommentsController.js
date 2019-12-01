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
      if (error.message.indexOf('foreign key') >= 0) {
        return next(new CustomError(404, 'Article not found'));
      }

      return next(error);
    }
  },

  flagComment: async (req, res, next) => {
    try {
      // flag article
      const articleComment = await ArticleComment.getbyId(req.params.commentId);

      // console.log(JSON.stringify(article));
      // console.log(JSON.stringify(articleComment));

      console.log(`req user Id: ${req.user.userId}`);

      console.log(`comment user id: ${articleComment.user_id}`);


      if (Number(req.params.articleId) !== articleComment.article_id) {
        console.log('got here');
        return next(new CustomError(403, 'comment does not belong to specified article'));
      }

      // user cant flag their own comment
      if (Number(req.user.userId) === articleComment.user_id) {
        return next(new CustomError(403, 'User cannot flag his/her own comment'));
      }

      const success = await articleComment.flag();

      if (success) {
        return responseHandler(res, 200, {
          message: 'Comment successfully flagged',
          commentId: articleComment.article_comment_id,
        });
      }

      return next(new CustomError(500, 'Error flagging comment'));

      // console.log(`article comment: ${JSON.stringify(articleComment)}`);
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Article not found'));
      }

      return next(error);
    }
  },

  unflagComment: async (req, res, next) => {
    try {
      // flag article
      const articleComment = await ArticleComment.getbyId(req.params.commentId);

      if (Number(req.params.articleId) !== articleComment.article_id) {
        console.log('got here');
        return next(new CustomError(403, 'comment does not belong to specified article'));
      }

      const success = await articleComment.unflag();

      if (success) {
        return responseHandler(res, 200, {
          message: 'Comment successfully unflagged',
          commentId: articleComment.article_comment_id,
        });
      }

      return next(new CustomError(500, 'Error unflagging comment'));

      // console.log(`article comment: ${JSON.stringify(articleComment)}`);
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
