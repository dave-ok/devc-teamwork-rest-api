import db from '.';
import { CREATE_MIGRATIONS_TABLE, CREATE_DB_VERSION_TABLE } from './sql/index';
import Migration from './migration';
import { isSubset, isEqualTo } from '../utils/compareItems';

export default class MigrationRunner {
  constructor(migrations, client, schemaName) {
    this.migrations = migrations;
    this.client = client;
    this.schemaName = schemaName;
    this.initialSchema = '';
  }

  async switchDefaultSchema(schema) {
    //find schema in search_path and replace with ''
    let result = await db.query(`select current_setting('search_path') as search_path`);
    let search_path = result.rows[0].search_path;
    
    let currentPath = search_path.split(',');
    const oldDefault = currentPath[0];

    const schemaIndex = currentPath.indexOf(schema);

    //if scema not in search_path put at beginning
    if(schemaIndex < 0){
      currentPath.unshift(schema);
      search_path = currentPath.join(',');
    }
    else if(schemaIndex > 0){
      //if found in middle remove and place at beginning
      currentPath.splice(schemaIndex, 1);
      currentPath.unshift(schema);
      search_path = currentPath.join(',');
    }

    //set default schema
    await db.query(`select set_config('search_path','${search_path}', false)`);

    return oldDefault;

  }

  async createTables() {
    
    const result = await db.query('select current_schema() as current_schema;');    

    let tablefound = await db.checkTableExists('migrations', this.schemaName);
    if (tablefound == null) {
      console.log('Creating migrations table');
      await db.query(CREATE_MIGRATIONS_TABLE);
    }

    tablefound = await db.checkTableExists('db_version', this.schemaName);
    if (tablefound == null) {
      console.log('Creating versions table');
      await db.query(CREATE_DB_VERSION_TABLE);
    }
  }

  async clean() { // clean migrations before run
    // we only use this on tests never production DB
    await db.wipeDB('teamwork_test_db', this.schemaName);
    await this.createTables();
  }

  async init(doCleanup) { // to be used before running migrations
    //set default
    const oldSchema = await this.switchDefaultSchema(this.schemaName);
    try {
      if (doCleanup) {
        await this.clean();
      } else {
        await db.recreateMissingSchema(this.schemaName);
        await this.createTables();
        await this.validateMigrations(false);
      }  
      
    } finally {
      await this.switchDefaultSchema(oldSchema);
    }   

    //add schema to search_path
  }

  async up(forceClean = false) {
    // initialize runner
    await this.init(forceClean);

    const oldSchema = await this.switchDefaultSchema(this.schemaName);

    // start transaction
    await db.query('BEGIN');
    try {
      // for each migration in migrations starting from 1st index
      for (let i = 0; i < this.migrations.length; i += 1) {
        // check db for for migration with current index
        const qry = await db.query(
          `select migrationid, objname, createsql, dropsql, seed
                    from migrations where id = ${i}`,
        );

        // if found
        if (qry.rowCount >= 1) {
          const dbMigration = qry.rows[0];

          // compare both to see that they match
          const isMatched = isEqualTo(dbMigration, this.migrations[i]);

          // if they don't throw an error
          if (!isMatched) {
            throw new Error('db migration does not match server migration');
          }
        } else {
          // not found
          // run the createsql migration

          console.log(`Creating ${this.migrations[i].objname} ...`);
          await db.query(this.migrations[i].createsql);

          console.log(`Seeding ${this.migrations[i].objname} ...`);
          await db.query(this.migrations[i].seed);

          // check that the object was created
          const tablename = this.migrations[i].objname;
          const tablefound = await db.checkTableExists(tablename, this.schemaName);
          if (tablefound == null) throw new Error(`Not found! Error creating ${tablename}`);

          // crete record in migrations table
          await db.query(
            `insert into migrations(id, migrationid, objname, createsql, dropsql, seed)
                      values($1, $2, $3, $4, $5, $6)`,
            [
              i,
              this.migrations[i].migrationid,
              tablename,
              this.migrations[i].createsql,
              this.migrations[i].dropsql,
              this.migrations[i].seed,
            ],
          );

          // update db_version to current index
          await db.query(`
            INSERT INTO db_version(id, version) 
            VALUES(1, ${i})
            ON CONFLICT (id) DO UPDATE SET version = EXCLUDED.version;           
          `);
        }
      }

      // commit on success
      await db.query('COMMIT');
      console.log('Migration up completed - transaction commited');
    } catch (error) {
      // rollback on error
      await db.query('ROLLBACK');
      console.log('Migration up failed - transaction rolled back');
      console.error(error.message);
    } finally {
      await this.switchDefaultSchema(oldSchema);
    }

  }

  async down(toIndex = 0) {
    const oldSchema = await this.switchDefaultSchema(this.schemaName);

    await db.query('BEGIN');
    try {
      // select dbmigrations from last to index and run in descending order
      const qry = await db.query(
        `select id, migrationid, objname, dropsql
                from migrations
                where id >= ${toIndex}
                order by id desc`,
      );

      const dbMigrations = qry.rows;

      // for each dbmigration
      for (let i = 0; i < dbMigrations.length; i += 1) {
        // run dropsql
        await db.query(dbMigrations[i].dropsql);
        
        // check if object was dropped        
        const tablename = dbMigrations[i].objname;
        console.log(`Dropped ${tablename}`);

        const tablefound = await db.checkTableExists(tablename, this.schemaName);
        if (tablefound !== null) throw new Error(`Not dropped! Error dropping ${tablename}`);

        // delete record from migrations table
        await db.query(`delete from migrations where id = ${dbMigrations[i].id}`);

        // update db_version
        const currVersion = dbMigrations[i].id - 1 >= 0 ? dbMigrations[i].id - 1 : null;
        await db.query(`
          INSERT INTO db_version(id, version) 
          VALUES(1, ${currVersion})
          ON CONFLICT (id) DO UPDATE SET version = EXCLUDED.version; 
        `);
      }

      // on success commit transaction
      await db.query('COMMIT');
      console.log('Migration down complete - transaction commited');
    } catch (error) {
      await db.query('ROLLBACK');
      console.log('Migration down failed - transaction rolled back');
      console.error(error.message);
    } finally {
      await this.switchDefaultSchema(oldSchema);
    }
  }

  async validateMigrations(checkAll) {
    const migs = this.migrations;

    // check if all items in array are migrations
    for (let i = 0; i < migs.count; i += 1) {
      if (!(migs[i] instanceof Migration)) {
        throw new Error(`Invalid migration at index ${i} of migrationRunner`);
      }
    }

    // get db migrations
    const qry = await db.query(
      `select migrationid, objname, createsql, dropsql, seed
            from migrations
            order by id`,
    );

    // sort out rows
    const dbMigrations = qry.rows;

    // checkAll if items in array are exactly what is in migrations table in DB
    if (checkAll) {
      const isIdentical = isEqualTo(this.migrations, dbMigrations);
      if (!isIdentical) throw new Error('Server migrations do not match DB migrations');
    } else if (dbMigrations.length !== 0) {
      //! checkAll if all items in migrations table are a subset of items in array
      // if dbmigrations is empty do nothing fresh db maybe

      // const isIdentical = compareArrayObjects(this.migrations, dbMigrations, true);
      const isIdentical = isSubset(this.migrations, dbMigrations);
      if (!isIdentical) throw new Error('DB migrations is not a subset of server migrations');
    }
  }
}
