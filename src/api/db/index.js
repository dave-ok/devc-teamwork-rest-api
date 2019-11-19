import customEnv  from 'custom-env';
import { CREATE_SCHEMA_PUBLIC } from './sql/index';

customEnv.env(true);

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 
    (`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
    `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

const pool = new Pool({
    connectionString: connectionString
});

const db = {
    query: (text, params, callback) => {
        return pool.query(text, params);
    },

    getClient: async () => {        
        return pool.connect();
    },

    checkTableExists: async (tablename) => {
        const queryString = `SELECT to_regclass('public.${tablename}') as tablefound`;
        
        const result = await pool.query(queryString);        
        return result.rows[0]['tablefound'];
    },

    dropTable: async (tablename) => {
        await pool.query(`DROP TABLE ${tablename}`);
        console.log(`Table ${tablename} dropped`);        
    },

    wipeDB: async (dbname) => {
        //sensitive operation pass dbName to be sure
        if (dbname !== process.env.DB_NAME) {
            return false;
        }

        await pool.query('DROP SCHEMA public CASCADE');
        await pool.query(CREATE_SCHEMA_PUBLIC);
        
        console.log('PUBLIC schema recreated!');
                
    }
    
}

export default db;