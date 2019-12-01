import Feed from '../models/feed.model';
import responseHandler from '../../utils/responseHandler';
import CustomError from '../../utils/customError';

const feedCtrl = {
  viewAll: async (req, res, next) => {
    try {
      const feed = await Feed.getAll({}, [], ['created_on DESC']);

      const mappedFeed = feed.map((row) => {
        const mapped = {};

        mapped.id = row.id;
        mapped.title = row.title;
        mapped.article = row.article === null ? undefined : row.article;
        mapped.url = row.image_url === null ? undefined : row.image_url;
        mapped.authorId = row.author_id;
        mapped.authorName = row.author_name;
        mapped.createdOn = row.created_on;

        return mapped;
      });

      return responseHandler(res, 200, mappedFeed);
    } catch (error) {
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'No posts found'));
      }

      return next(error);
    }
  },
};

export default feedCtrl;
