#!/usr/bin/env node

const path = require('path');
const Server = require('../src/server');

const config = {
  server: {
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
    }
  }
};

(async function() {
  const server = new Server(config.server)
  await server.start();
  console.log(`listening on port ${config.server.port}`);
})();
