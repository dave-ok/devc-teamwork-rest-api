import DBModel from './dbmodel';

export default class UserRole extends DBModel {
  constructor() {
    super();

    this.user_role_id = -1;
    this.user_id = '';
    this.role_id = '';
    // specify properties here with underscore
  }

  static pkfield() { return 'user_role_id'; }

  // primary key field
  static viewTable() { return 'vw_user_roles'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'user_roles'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'role_id',
      'user_id'
    ];
  }

  static async getbyUserId(id){    
    return this.getAll(
      {user_id: id},
      ['role_id', 'role']
    );
  }
}
