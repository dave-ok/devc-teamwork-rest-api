import customEnv from 'custom-env';
import { CREATE_SCHEMA_PUBLIC } from './sql/index';

customEnv.env(true);

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL
    || (`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}`
    + `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

const pool = new Pool({
  connectionString,
});


const db = {
  query: (text, params) => pool.query(text, params),

  getClient: async () => pool.connect(),

  checkTableExists: async (tablename) => {
    const queryString = `SELECT to_regclass('public.${tablename}') as tablefound`;

    const result = await pool.query(queryString);
    return result.rows[0].tablefound;
  },

  dropTable: async (tablename) => {
    await pool.query(`DROP TABLE ${tablename}`);
    console.log(`Table ${tablename} dropped`);
  },

  checkSchemaExists: async (schema) => {
    const queryString = `SELECT EXISTS (SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name = '${schema}') as schemafound;`;

    const result = await pool.query(queryString);
    return result.rows[0].schemafound;
  },

  recreateSchema: async (schema) => {
    const client = await pool.connect();

    const queryString = `SELECT EXISTS (SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name = '${schema}') as schemafound;`;

    const result = await client.query(queryString);
    const schemaExists = result.rows[0].schemafound;

    if (!schemaExists) {
      await client.query(CREATE_SCHEMA_PUBLIC);
      console.log('Public schema not found, created!');
    }

    await client.release();

    return true;
  },

  wipeDB: async (dbname) => {
    // sensitive operation pass dbName to be sure
    if (dbname !== process.env.DB_NAME) {
      return false;
    }

    const client = await pool.connect();

    const queryString = `SELECT EXISTS (SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name = 'public') as schemafound;`;

    const result = await pool.query(queryString);
    const schemaExists = result.rows[0].schemafound;

    if (schemaExists) {
      await client.query('DROP SCHEMA public CASCADE');
    }

    await client.query(CREATE_SCHEMA_PUBLIC);
    await client.release();

    console.log('PUBLIC schema recreated!');

    return true;
  },

};

export default db;
