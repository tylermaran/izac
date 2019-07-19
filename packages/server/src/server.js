const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const handlers = require('./handlers');

module.exports = class Server {
  constructor(options) {
    this.server;
    this.port = options.port;

    this.app = express();

    this.app.use(cors(options.cors));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    configureRoutes(this.app, options.client.baseDir);
  }

  async start() {
    return new Promise(r => this.server = this.app.listen(this.port, r));
  }

  async stop() {
    return new Promise(r => this.server.close(r));
  }
}

function configureRoutes(app, clientDir) {
  // Server routes (take priority over client routing).
  app.post('/order/:drink?', handlers.order.drink);
  app.post('/led/blink-once', handlers.led.blinkOnce);

  // We only concern ourselves with client routes when we're
  // serving up a generated bundle in production.
  //
  // @TODO to avoid overlap between server and client routes, we
  //       can serve our backend API routes under a unique top-level
  //       route, or add some fancy middleware. Be aware: if something
  //       works in development and not in production --- check your
  //       client routes for any overlap with the server routes above.
  //
  if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(clientDir));
    // Handle React routing, return all requests to React app
    app.get('*', (_, res) => res.sendFile(path.join(clientDir, 'index.html')));
  }
}
