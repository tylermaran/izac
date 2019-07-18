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
  app.post('/order/:drink?', handlers.order.drink);

  if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(clientDir));
    // Handle React routing, return all requests to React app
    app.get('*', (_, res) => res.sendFile(path.join(clientDir, 'index.html')));
  }
}
