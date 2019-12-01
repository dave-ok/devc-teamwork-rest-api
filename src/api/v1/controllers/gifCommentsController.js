import GifComment from '../models/gifcomment.model';
import responseHandler from '../../utils/responseHandler';
import CustomError from '../../utils/customError';

const gifCommentsCtrl = {
  addComment: async (req, res, next) => {
    try {
      // create comment on gif
      const gifComment = new GifComment();
      gifComment.gif_id = req.params.gifId;
      gifComment.user_id = req.user.userId;
      gifComment.comment = req.body.comment;
      await gifComment.save();

      // console.log(`gif comment: ${JSON.stringify(gifComment)}`);

      return responseHandler(res, 201, {
        message: 'Comment successfully created',
        createdOn: gifComment.created_on,
        gifTitle: gifComment.title,
        comment: gifComment.comment,
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('foreign key') >= 0) {
        return next(new CustomError(404, 'Gif not found'));
      }

      return next(error);
    }
  },

  flagComment: async (req, res, next) => {
    try {
      // flag gif
      const gifComment = await GifComment.getbyId(req.params.commentId);

      // console.log(JSON.stringify(gif));
      // console.log(JSON.stringify(gifComment));

      console.log(`req user Id: ${req.user.userId}`);

      console.log(`comment user id: ${gifComment.user_id}`);


      if (Number(req.params.gifId) !== gifComment.gif_id) {
        console.log('got here');
        return next(new CustomError(403, 'comment does not belong to specified gif'));
      }

      // user cant flag their own comment
      if (Number(req.user.userId) === gifComment.user_id) {
        return next(new CustomError(403, 'User cannot flag his/her own comment'));
      }

      const success = await gifComment.flag();

      if (success) {
        return responseHandler(res, 200, {
          message: 'Comment successfully flagged',
          commentId: gifComment.gif_comment_id,
        });
      }

      return next(new CustomError(500, 'Error flagging comment'));

      // console.log(`gif comment: ${JSON.stringify(gifComment)}`);
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Gif not found'));
      }

      return next(error);
    }
  },

  unflagComment: async (req, res, next) => {
    try {
      // flag gif
      const gifComment = await GifComment.getbyId(req.params.commentId);

      if (Number(req.params.gifId) !== gifComment.gif_id) {
        console.log('got here');
        return next(new CustomError(403, 'comment does not belong to specified gif'));
      }

      const success = await gifComment.unflag();

      if (success) {
        return responseHandler(res, 200, {
          message: 'Comment successfully unflagged',
          commentId: gifComment.gif_comment_id,
        });
      }

      return next(new CustomError(500, 'Error unflagging comment'));

      // console.log(`gif comment: ${JSON.stringify(gifComment)}`);
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Gif not found'));
      }

      return next(error);
    }
  },


};

export default gifCommentsCtrl;
