import DBModel from './dbmodel';

export default class Tag extends DBModel {
  constructor() {
    super();

    this.tag_id = -1;
    this.tag = '';
    // specify properties here with underscore
  }

  static pkfield() { return 'tag_id'; }

  // primary key field
  static viewTable() { return 'tags'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'tags'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'tag'
    ];
  }
}
