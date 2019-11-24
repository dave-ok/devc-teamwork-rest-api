import DBModel from './dbmodel';

export default class ArticleComment extends DBModel {
  constructor() {
    super();

    this.article_comment_id = -1;
    this.article_id = '';
    this.user_id = '';
    this.comment = '';
    this.created_on = '';
    this.flagged = false;
  }

  static pkfield() { return 'article_comment_id'; }

  // primary key field
  static viewTable() { return 'vw_article_comments'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'article_comments'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'article_id',
      'user_id',
      'comment',
      'flagged',
    ];
  }

  async flag() {
    if (this.article_comment_id === -1) return false;

    this.flagged = true;
    await this.save();
    return true;
  }

  async unflag() {
    if (this.article_comment_id === -1) return false;

    this.flagged = false;
    await this.save();
    return true;
  }

  static async getByArticleId(id) {
    return this.getAll(
      { article_id: id },
      [
        'article_comment_id', 'comment', 'user_id',
        'created_on', 'flagged', 'author_name',
        'email', 'department',
      ],
    );
  }
}
