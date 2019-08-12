const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const handlers = require('./handlers');
const Database = require('./db');
const { configureRoutes } = require('./routes');

module.exports = class Server {

  constructor(options) {
    this.server; // initialized in method `start()`

    this.port = options.port;
    this.db = new Database(options.sqlite3.filename);
    this.app = express();

    this.app.use(cors(options.cors));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    configureRoutes(this.app, options.client.baseDir, this.db);
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, function(error) {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  async stop() {
    // @TODO: will this ever reject?
    return new Promise(r => this.server.close(r));
  }
}
