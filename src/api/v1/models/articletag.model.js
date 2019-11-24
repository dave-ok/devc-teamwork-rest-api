import DBModel from './dbmodel';

export default class ArticleTag extends DBModel {
  constructor() {
    super();

    this.article_tag_id = -1;
    this.article_id = '';
    this.tag_id = '';
  }

  static pkfield() { return 'article_tag_id'; }

  // primary key field
  static viewTable() { return 'vw_article_tags'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'article_tags'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'article_id',
      'tag_id',
    ];
  }

  static async getbyArticleId(id) {
    return this.getAll(
      { article_id: id },
      ['article_tag_id', 'tag_id', 'tag'],
    );
  }
}
