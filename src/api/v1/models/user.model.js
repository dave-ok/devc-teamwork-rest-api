import DBModel from './dbmodel';
import UserRole from './userrole.model';

export default class User extends DBModel {
  constructor() {
    super();

    this.user_id = -1;
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.password = '';
    this.gender = '';
    this.job_role = '';
    this.department = '';
    this.address = ''; // specify properties here with underscore
  }

  static pkfield() { return 'user_id'; }

  // primary key field
  static viewTable() { return 'vw_users'; }

  // prejoin in db as view for lookup fields
  static modifyTable() { return 'users'; } // table meant to write to

  // fields to be written to
  static modifyFields() {
    return [
      'first_name',
      'last_name',
      'email',
      'password',
      'gender',
      'job_role',
      'department',
      'address',
    ];
  }

  static async getbyIdWithPermissions(id) {
    const result = await this.getbyId(id);

    if (result) {
      try {
        const roles = await UserRole.getbyUserId(id);
        if (roles) {
          // iterate through array and get all values into array
          const permissions = roles.reduce((perms, record) => {
            perms.push(record.role);
            return perms;
          }, []);

          result.permissions = permissions;
        }
      } catch (error) {
        // ignore error if no permissions
        if (error.message.indexOf('not found') < 0) {
          throw error;
        }

        result.permissions = [];
      }
    }

    return result;
  }
}
