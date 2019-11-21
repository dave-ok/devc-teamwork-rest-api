import { expect } from 'chai';
import Migration from '../../../src/api/db/migration';

describe('Migrations', () => {
  describe('Given a migration created with ID, OBJECTNAME, CREATE and DROP arguments', () => {
    let migration;
    const MIGRATIONID = 'create_table_stuffs';
    const OBJECTNAME = 'stuffs';
    const CREATE = 'CREATE TABLE stuff';
    const DROP = 'DROP TABLE stuff';

    beforeEach(() => {
      migration = new Migration(
        MIGRATIONID,
        OBJECTNAME,
        CREATE,
        DROP,
      );
    });

    describe('when up method is called', () => {
      it('should return CREATE string', () => {
        expect(migration.up()).to.be.equal(CREATE);
      });
    });
    describe('when down method is called', () => {
      it('should return DROP string', () => {
        expect(migration.down()).to.be.equal(DROP);
      });
    });
    describe('when OBJECTNAME method is called', () => {
      it('should return OBJECTNAME string', () => {
        expect(migration.objname).to.be.equal(OBJECTNAME);
      });
    });
    describe('when ID method is called', () => {
      it('should return ID string', () => {
        expect(migration.migrationid).to.be.equal(MIGRATIONID);
      });
    });
  });
});
