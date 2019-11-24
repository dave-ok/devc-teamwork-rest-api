import customEnv from 'custom-env';
import db from '../src/api/db';
import MigrationRunner from '../src/api/db/migrationRunner';
import migrations from '../src/api/db/migrations';
import { testTablesSeed } from './api/db/sql';

// global hooks before running all tests
before(async function initDb() {
  // set longer timeout for DB operations
  this.timeout(10000);

  let dbClient;

  try {
    // initialize environment vars
    customEnv.env('test');

    // get a client connection to DB
    dbClient = await db.getClient();

    // create migrationRunner to run migrations
    const migrationRunner = new MigrationRunner(migrations, dbClient, 'public');

    // run down migration to clear DB and up to recreate DB
    await migrationRunner.down();
    await migrationRunner.up(true);

    // run custom script to seed DB for test
    await dbClient.query(testTablesSeed);
  } finally {
    await dbClient.release();
  }
});
