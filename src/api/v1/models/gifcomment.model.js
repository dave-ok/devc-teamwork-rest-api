import DBModel from './dbmodel';

export default class GifComment extends DBModel {
  constructor() {
    super();

    this.gif_comment_id = -1;
    this.gif_id = '';
    this.user_id = '';
    this.comment = '';
    this.created_on = '';
    this.flagged = false;
    
  }

  static pkfield() { return 'gif_comment_id'; }

  // primary key field
  static viewTable() { return 'vw_gif_comments'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'gif_comments'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'gif_id',
      'user_id',
      'comment',
      'flagged'
    ];
  }

  async flag(){
    if(this.gif_comment_id === -1) return false;

    this.flagged = true;
    await this.save();
    return true;
  }

  async unflag(){
    if(this.gif_comment_id === -1) return false;

    this.flagged = false;
    await this.save();
    return true;
  }

  static async getByGifId(id){
    return this.getAll(
      {gif_id: id},
      [
        'gif_comment_id', 'comment', 'user_id', 'created_on', 'flagged', 
        'user_name', 'email', 'department'
      ]
    );
  }
  
}
