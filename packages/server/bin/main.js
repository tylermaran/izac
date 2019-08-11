#!/usr/bin/env node

const path = require('path');
const Server = require('../src/server');
const pins = require('../src/pins');

console.log('raspberry pi pinouts:');
console.log(pins);

const cwd = process.cwd(); // store all files we create in the cwd.

const config = {
  port: process.env.PORT || 5000,
  cors: {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type']
  },
  client: {
    // @TODO: sort-of hard coded at the moment and relies on the
    //        structure of the build directory. would be better to
    //        pass this in as an environment variable.
    //
    //        Keeping it as-is because it's gettin' late, but also
    //        this code is only used in production builds and not
    //        during the server development. but it's ugly af.
    baseDir: path.join(__dirname, '..', '..', 'client')
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
