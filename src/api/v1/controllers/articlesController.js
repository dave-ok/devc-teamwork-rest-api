import Article from '../models/article.model';
import responseHandler from '../../utils/responseHandler';
import CustomError from '../../utils/customError';
import ArticleComment from '../models/articlecomment.model';

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
      return next(error);
    }
  },

  updateArticle: async (req, res, next) => {
    try {
      // get articleId from url params
      const { articleId } = req.params;

      // retrieve article from DB
      const article = await Article.getbyId(articleId);

      // console.log(`article: ${JSON.stringify(article)}`);

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
      else {
        return next(error);
      }
      
    }
  },

  deleteArticle: async (req, res, next) => {
    try {
      // get articleId from url params
      const { articleId } = req.params;

      // retrieve article from DB
      const article = await Article.getbyId(articleId);

      // console.log(`article: ${JSON.stringify(article)}`);
      
      // if article does not belong to user return error
      if (article.user_id !== req.user.userId) {
        return next(new CustomError(404, 'Article not found among your own articles'));
      }

      await article.deleteOne();

      return responseHandler(res, 200, {
        message: 'Article succesfully deleted',
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Article not found'));
      }
      else {
        return next(error);
      }

    }
  },

  viewArticle: async (req, res, next) => {
    try {
      // get articleId from url params
      const { articleId } = req.params;
      // console.log(`view articleID: ${articleId}`);

      // retrieve article from DB
      const article = await Article.getArticle(articleId);

      // console.log(`article: ${JSON.stringify(article)}`);

      // map DB comments fields and return selected and renamed fields
      const mappedComments = article.comments.map((comment) => {
        const mapped = {};
        mapped.commentId = comment.article_comment_id;
        mapped.comment = comment.comment;
        mapped.authorId = comment.user_id;
        mapped.authorName = comment.author_name;

        return mapped;
      });

      // map DB tags fields and return selected and renamed fields
      const mappedTags = article.tags.map((tag) => {
        const mapped = {};
        mapped.articleTagId = tag.article_tag_id;
        mapped.tag = tag.tag;

        return mapped;
      });

      return responseHandler(res, 200, {
        id: article.article_id,
        createdOn: article.created_on,
        title: article.title,
        article: article.article,
        authorId: article.user_id,
        authorName: article.author_name,
        comments: mappedComments,
        tags: mappedTags,
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(404, 'Article not found'));
      }
      else {
        return next(error);
      }
      
    }
  },

  viewAllArticles: async (req, res, next) => {
    try {
      // retrieve articles from DB
      const articles = await Article.getAll({}, [], ['created_on DESC']);

      // console.log(`article: ${JSON.stringify(article)}`);

      // map DB comments fields and return selected and renamed fields
      const mappedArticles = articles.map((article) => {
        const mapped = {};

        mapped.articleId = article.article_id;
        mapped.article = article.article;
        mapped.title = article.title;
        mapped.authorId = article.user_id;
        mapped.authorName = article.author_name;
        mapped.createdOn = article.created_on;

        return mapped;
      });

      return responseHandler(res, 200, {
        articles: mappedArticles,
        message: `${mappedArticles.length} articles found`,
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('not found') >= 0) {
        return responseHandler(res, 200, {
          articles: [],
          message: 'No articles found',
        });
      }
      else {
        return next(error);
      }

      
    }
  },

  addComment: async (req, res, next) => {
    try {
      // create comment on article
      const articleComment = new ArticleComment();
      articleComment.article_id = req.params.articleId;
      articleComment.user_id = req.user.userId;
      articleComment.comment = req.body.comment;
      articleComment.save();

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
      else {
        return next(error);
      }

      
    }
  },

};

export default articlesCtrl;
