import DBModel from './dbmodel';
import ArticleComment from './articlecomment.model';
import ArticleTag from './articletag.model';

export default class Article extends DBModel {
  constructor() {
    super();

    this.article_id = -1;
    this.article = '';
    this.title = '';
    this.user_id = '';
    this.created_on = '';
    this.flagged = false;
  }

  static pkfield() { return 'article_id'; }

  // primary key field
  static viewTable() { return 'vw_articles'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'articles'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'article',
      'title',
      'user_id',
      'flagged',
    ];
  }

  async flag() {
    if (this.article_id === -1) return false;

    this.flagged = true;
    await this.save();
    return true;
  }

  async unflag() {
    if (this.article_id === -1) return false;

    this.flagged = false;
    await this.save();
    return true;
  }

  async addComment(userId, comment) {
    const articleComment = new ArticleComment();

    articleComment.article_id = this.article_id;
    articleComment.comment = comment;
    articleComment.user_id = userId;
    await articleComment.save();

    return articleComment.article_comment_id;
  }


  static async getArticle(id) {
    const result = await this.getbyId(id);
    if (result) {
      try {
        result.comments = await ArticleComment.getByArticleId(id);
      } catch (error) {
        if (error.message.indexOf('not found') < 0) {
          throw error;
        }
        result.comments = [];
      }

      try {
        result.tags = await ArticleTag.getbyArticleId(id);
      } catch (error) {
        if (error.message.indexOf('not found') < 0) {
          throw error;
        }

        result.tags = [];
      }
    }

    return result;
  }
}
