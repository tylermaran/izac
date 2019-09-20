#!/usr/bin/env node

const path = require('path');
const Server = require('../src/server');
const migrations = require('../src/migrations');
const cwd = process.cwd(); // store all files we create in the cwd.

const config = {
  port: process.env.WEB_SERVER_PORT || (() => {
    console.error('you must set WEB_SERVER_PORT');
    process.exit(1);
  })(),
  cors: {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type']
  },
  client: {
    react: {
      baseDir: process.env.REACT_BUILD_DIR || (() => {
        if (process.env.NODE_ENV === 'production') {
          console.error('you must set REACT_BUILD_DIR');
          process.exit(1);
        }

        return '/dev/null';
      })()
    }
  },
  server: {
    pin: {
      port: process.env.PIN_SERVER_PORT || (() => {
        console.error('you must set PIN_SERVER_PORT');
        process.exit(1);
      })()
    }
  },
  sqlite3: {
    filename: path.join(cwd, 'db.sqlite3')
  },
  migrations: {
    migrationsDirectory: path.join(__dirname, '..', 'migrations'),
    stateStore: path.join(cwd, '.migrate')
  }
};

(async function() {
  try {
    // load new migrations before starting server
    await migrations.load(config.migrations.migrationsDirectory,
                          config.migrations.stateStore);
  } catch (error) {
    console.error('failed to load migrations');
    console.error(error);
    process.exit(1);
  }

  const server = new Server(config);
  try {
    await server.start();
  } catch(error) {
    console.error('failed to start the server');
    console.error(error);
    process.exit(1);
  }

  console.log(`listening on port ${config.port}`);

})().catch(fatal_error => {
  console.error(fatal_error)
}) ;
