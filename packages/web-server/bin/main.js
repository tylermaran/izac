#!/usr/bin/env node

const path = require('path');
const Server = require('../src/server');
const cwd = process.cwd(); // store all files we create in the cwd.

const config = {
  port: process.env.PORT || 5000,
  cors: {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type']
  },
  client: {
      baseDir: process.env.REACT_BUILD_DIR || (() => {
          console.error('you must set REACT_BUILD_DIR');
          process.exit(1);
      })()
  },
  sqlite3: {
    filename: path.join(cwd, 'db.sqlite3')
  }
};

(async function() {

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
