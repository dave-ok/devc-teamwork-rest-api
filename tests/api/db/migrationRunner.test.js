import { expect } from 'chai';
import db from '../../../src/api/db';
import MigrationRunner from '../../../src/api/db/migrationRunner';

import Migration from '../../../src/api/db/migration';
import {
  CREATE_TEST_1, DROP_TEST_1, CREATE_TEST_2, DROP_TEST_2,
} from './sql';

describe('Migration Runner', () => {
  describe('Given a valid db connection', () => {
    let dbClient;

    before(async () => {
      await db.wipeDB('teamwork_test_db', 'test');
      dbClient = await db.getClient();
    });

    describe('when created', () => {
      let migrationRunner;

      before(() => {
        const migrationsArray = [
          new Migration('create_users_table', 'Users table', CREATE_TEST_1, DROP_TEST_1),
          new Migration('create_departments_table', 'Departments table', CREATE_TEST_2, DROP_TEST_2),
        ];

        migrationRunner = new MigrationRunner(migrationsArray, dbClient, 'test');
      });

      it('should have property migrations which is a non-empty array', () => {
        expect(migrationRunner).to.haveOwnProperty('migrations');
        expect(migrationRunner.migrations).to.be.an('array').that.is.not.empty;
      });

      // test that each item in array is a migration object, use instanceOf
      it('should have a database connection', () => {
        expect(migrationRunner).to.haveOwnProperty('client');
        expect(migrationRunner.client).to.be.an('object');
      });
    });

    describe('when migration run is initiated', () => {
      let migrationRunner;

      before(async () => {
        const migrationsArray = [
          new Migration('create_users_table', 'Users table', CREATE_TEST_1, DROP_TEST_1),
          new Migration('create_departments_table', 'Departments table', CREATE_TEST_2, DROP_TEST_2),
        ];


        migrationRunner = new MigrationRunner(migrationsArray, dbClient, 'test');
        await migrationRunner.init(true);
      });

      it('migration table should be created if not exist', async () => {
        const tablefound = await db.checkTableExists('migrations', 'test');
        expect(tablefound).to.not.be.null;
      });

      it('db_version table should exist', async () => {
        const tablefound = await db.checkTableExists('db_version', 'test');
        expect(tablefound).to.not.be.null;
      });

      it('should throw error if order of migrations in array dont match for db(without clean)', () => {

      });
      it('should recreate schema, migrations and db_version tables if "clean" option is set', () => {

      });
    });
    describe('when migration up is run', () => {
      it('should rollback transactions to initial state if an error is thrown', () => {

      });
      it('should commit transactions if all migrations run successfully', () => {

      });
    });
    describe('when migration down is run', () => {
      it('should rollback transactions to initial state if an error is thrown', () => {

      });
      it('should commit transactions if all migrations run successfully', () => {

      });
    });
    describe('when migration down is complete', () => {
      it('db_version should be null', () => {

      });
      it('migrations table should be empty', () => {

      });
    });

    describe('when migration up is complete', () => {
      it('db_version should be equal to last index in array', () => {

      });
      it('all items in migrations table must be same as items in array', () => {

      });
    });

    after(() => {
      dbClient.release();
    });
  });
});
