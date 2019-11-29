import Gif from '../models/gif.model';
import responseHandler from '../../utils/responseHandler';
import CustomError from '../../utils/customError';

const gifsCtrl = {

  createGif: async (req, res, next) => {
    // console.log(`req.file: ${req.file.url}`);
    try {
      const gif = new Gif();
      gif.title = req.body.title;
      gif.image_url = req.file.url;
      gif.user_id = req.user.userId;
      await gif.save();

      return responseHandler(res, 201, {
        message: 'Gif succesfully posted',
        gifId: gif.gif_id,
        title: gif.title,
        imageUrl: gif.image_url,
        createdOn: gif.created_on,
      });
    } catch (error) {
      /* console.log(error.message);
      if (error.message.indexOf('file format') >= 0) {
        return next(new CustomError(422, 'Invalid file format. Only gif images allowed'));
      } */
      return next(error);
    }
  },

  deleteGif: async (req, res, next) => {
    try {
      // get gifId from url params
      const { gifId } = req.params;

      // retrieve gif from DB
      const gif = await Gif.getbyId(gifId);

      // console.log(`gif: ${JSON.stringify(gif)}`);

      // if gif does not belong to user return error
      if (gif.user_id !== req.user.userId) {
        return next(new CustomError(404, 'Gif not found among your own gifs'));
      }

      await gif.deleteOne();

      return responseHandler(res, 200, {
        message: 'Gif succesfully deleted',
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Gif not found'));
      }

      return next(error);
    }
  },

  viewGif: async (req, res, next) => {
    try {
      // get gifId from url params
      const { gifId } = req.params;
      // console.log(`view gifID: ${gifId}`);

      // retrieve gif from DB
      const gif = await Gif.getGif(gifId);

      // console.log(`gif: ${JSON.stringify(gif)}`);

      // map DB comments fields and return selected and renamed fields
      const mappedComments = gif.comments.map((comment) => {
        const mapped = {};
        mapped.commentId = comment.gif_comment_id;
        mapped.comment = comment.comment;
        mapped.authorId = comment.user_id;
        mapped.authorName = comment.author_name;

        return mapped;
      });

      return responseHandler(res, 200, {
        id: gif.gif_id,
        createdOn: gif.created_on,
        title: gif.title,
        imageUrl: gif.image_url,
        authorId: gif.user_id,
        authorName: gif.author_name,
        comments: mappedComments,
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

export default gifsCtrl;
