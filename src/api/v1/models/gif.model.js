import DBModel from './dbmodel';
import GifComment from './gifcomment.model';

export default class Gif extends DBModel {
  constructor() {
    super();

    this.gif_id = -1;
    this.image_url = '';
    this.title = '';
    this.user_id = '';
    this.created_on = '';
    this.flagged = false;
  }

  static pkfield() { return 'gif_id'; }

  // primary key field
  static viewTable() { return 'vw_gifs'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'gifs'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'image_url',
      'title',
      'user_id',
      'flagged',
    ];
  }

  async flag() {
    if (this.gif_id === -1) return false;

    this.flagged = true;
    await this.save();
    return true;
  }

  async unflag() {
    if (this.gif_id === -1) return false;

    this.flagged = false;
    await this.save();
    return true;
  }

  static async getGif(id) {
    const result = await this.getbyId(id);
    try {
      result.comments = await GifComment.getByGifId(id);
    } catch (error) {
      if (error.message.indexOf('not found') < 0) {
        throw error;
      }
      result.comments = [];
    }

    return result;
  }

  async addComment(userId, comment) {
    const gifComment = new GifComment();

    gifComment.gif_id = this.gif_id;
    gifComment.comment = comment;
    gifComment.user_id = userId;
    await gifComment.save();

    return gifComment.gif_comment_id;
  }
}
