import envModule from 'custom-env';
import app from './api';
import MigrationRunner from './api/db/migrationRunner';
import migrations from './api/db/migrations';
import db from './api/db';

// load environment variables
envModule.env(true);

// initialize db - run migrations in IIFE
try {
  (async () => {
    const migrationRunner = new MigrationRunner(migrations, db.getClient, 'public');

    if (process.env.MIG_DOWN === '1') {
      // run migration down first

      console.log('Migrating Down');
      await migrationRunner.down();
    }

    await migrationRunner.up();
  })();
} catch (error) {
  console.log(error.message);
  throw error;
}

const http = require('http');

const server = http.createServer(app);
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }

  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

server.listen(port);
