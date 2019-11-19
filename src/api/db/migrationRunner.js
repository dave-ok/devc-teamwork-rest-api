import db from ".";
import { CREATE_MIGRATIONS_TABLE, CREATE_DB_VERSION_TABLE } from './sql/index';
import Migration from "./migration";

export class MigrationRunner {
    constructor(migrations, client, done) {
        this.migrations = migrations;
        this.client = client;

        //run async initialization db functions in here
        //create migrations table if it does not exist
        //create db_version table
        (async (callback) => {
            //check if table exists 
            let tablefound = await db.checkTableExists('migrations');            

            if (tablefound == null) {
                await db.query(CREATE_MIGRATIONS_TABLE);                
            }

            tablefound = await db.checkTableExists('db_version');            

            if (tablefound == null) {
                await db.query(CREATE_DB_VERSION_TABLE);                
            }

            callback();
                        
        }).bind(this, done)();
        
    }

    async createTables () {
        let tablefound = await db.checkTableExists('migrations');
        if (tablefound == null) {
            await db.query(CREATE_MIGRATIONS_TABLE);                
        }

        tablefound = await db.checkTableExists('db_version');
        if (tablefound == null) {
            await db.query(CREATE_DB_VERSION_TABLE);                
        }
    }

    async clean(){ //clean migrations before run
        await db.wipeDB('teamwork_test_db');
        await this.createTables();
        
    }

    async init(clean){ // to be used before running migrations
        if (clean) {
           await clean(); 
        }
        else {
            await this.validateMigrations(false);
        }

    }

    async up(forceClean) {
        //initialize runner
        await this.init(forceClean);

        //start transaction
        await db.query('BEGIN');
        try {
            //for each migration in migrations starting from 1st index
            for (let i=0; i < this.migrations.length; i++) {
                 
                //check db for for migration with current index
                let qry = await db.query(
                    `select migrationid, objname, createsql, dropsql
                    from migrations where id = ${i}`
                );
                
                 //if found
                if(qry.rowCount >= 1) {
                    const dbMigration = qry.rows[0];
                    
                    //compare both to see that they match
                    const isMatched = compareArrayObjects(dbMigration, this.migrations[i]);
                    
                    //if they don't throw an error   
                    if (!isMatched) {
                        throw new Error('db migration does not match server migration');
                    }                
                    
                    //if they match continue to next item in the loop
                    continue;
                }
                
                //not found
                //run the createsql migration
                await db.query(this.migrations[i].createsql);

                //check that the object was created
                let tablename = this.migrations[i].objname;
                let tablefound = await db.checkTableExists(tablename);
                if(tablefound == null) throw new Error(`Not found! Error creating ${tablename}`);

                //crete record in migrations table
                await db.query(
                    `insert into migrations(id, migrationid, objname, createsql, dropsql)
                    values($1, $2, $3, $4, $5)`,
                    [
                        i, 
                        this.migrations[i].migrationid, 
                        tablename, 
                        this.migrations[i].createsql,
                        this.migrations[i].dropsql               
                    ]
                );

                //update db_version to current index
                await db.query(`update db_version set version = ${i}`);

            }

            //commit on success
            await db.query('COMMIT');
            console.log('transaction commited');


        } catch (error) {
            //rollback on error            
            await db.query('ROLLBACK');
            console.log('transaction rolled back');
            console.error(error.message);
        }
    }

    async down(toIndex) {
        await db.query('BEGIN');
        try {
            //select dbmigrations from last to index and run in descending order
            let qry = db.query(
                `select id, migrationid, objname, dropsql
                from migrations
                where id >= ${toIndex}
                order by id desc`
            );

            const dbMigrations = qry.rows;

            //for each dbmigration 
            for (let i=0; i < dbMigrations.length; i++) {
                // run dropsql
                await db.query(dbMigrations[i].dropsql);

                // check if object was dropped
                let tablename = this.dbMigrations[i].objname;
                let tablefound = await db.checkTableExists(tablename);
                if(tablefound !== null) throw new Error(`Not dropped! Error dropping ${tablename}`);

                // delete record from migrations table
                await db.query(`delete from migrations where id = ${dbMigrations[i].id}`);

                //update db_version
                let currVersion = dbMigrations[i].id - 1 >= 0 ? dbMigrations[i].id - 1 : null;
                await db.query(`update db_version set version = ${currVersion}`);
            }
            
            //on success commit transaction
            await db.query('COMMIT');
            console.log('transaction commited')
        } catch (error) {
            await db.query('ROLLBACK');
            console.log('transaction rolled back');
            console.error(error.message);
        }
    }

    async validateMigrations(checkAll) {
        const migs = this.migrations;

        //check if all items in array are migrations
        for (let i=0; i < migs.count; i++){
            if (!(migs[i] instanceof Migration)){
              throw new Error(`Invalid migration at index ${i} of migrationRunner`);  
            }
        }

        //get db migrations
        const qry = await db.query(
            `select migrationid, objname, createsql, dropsql
            from migrations
            order by id`
        );

        //sort out rows
        const dbMigrations = qry.rows;

        //checkAll if items in array are exactly what is in migrations table in DB
        if(checkAll){
            const isIdentical = compareArrayObjects(this.migrations, dbMigrations);
            if (!isIdentical) throw new Error('Server migrations do not match DB migrations'); 
        }
        //!checkAll if all items in migrations table are a subset of items in array
        else {
            //if dbmigrations is empty do nothing fresh db maybe
            if (dbMigrations.length !== 0) {
                const isIdentical = compareArrayObjects(this.migrations, dbMigrations, true);
                if (!isIdentical) throw new Error('DB migrations is not a subset of server migrations');                
            }

        }

        
    }
    
}