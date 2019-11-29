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
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Gif not found'));
      }

      return next(error);
    }
  },


};

export default gifCommentsCtrl;
