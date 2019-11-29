import Gif from '../models/gif.model';
import responseHandler from '../../utils/responseHandler';
// import CustomError from '../../utils/customError';

const gifsCtrl = {

  createGif: async (req, res, next) => {
    console.log(`req.file: ${req.file.url}`);
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


};

export default gifsCtrl;
