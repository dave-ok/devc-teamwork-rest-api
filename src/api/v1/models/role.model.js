import DBModel from './dbmodel';

export default class Role extends DBModel {
  constructor() {
    super();

    this.role_id = -1;
    this.role = '';
    // specify properties here with underscore
  }

  static pkfield() { return 'role_id'; }

  // primary key field
  static viewTable() { return 'roles'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'roles'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'role',
    ];
  }
}
