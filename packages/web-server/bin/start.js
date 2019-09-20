#!/usr/bin/env node

const Server = require('../src/server');
const migrations = require('../src/migrations');
const config = require('../config');

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
