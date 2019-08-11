const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
<<<<<<< Updated upstream
const handlers = require('./handlers');

const fs = require('fs');
<<<<<<< HEAD

const Database = require('./db');
=======
const pins = require('./pins');
=======

const Database = require('./db');
const { configureRoutes } = require('./routes');
>>>>>>> Stashed changes
>>>>>>> ae8b249... lol commit to master --- thx for code review fredi

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
<<<<<<< HEAD
    return new Promise(r => this.server = this.app.listen(this.port, r));
=======
<<<<<<< Updated upstream
    await initDatabase(this.sqlite3_db);
    return new Promise(r => this.servqer = this.app.listen(this.port, r));
=======
    // @TODO: will this ever reject?
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, function(error) {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
>>>>>>> Stashed changes
>>>>>>> ae8b249... lol commit to master --- thx for code review fredi
  }

  async stop() {
    // @TODO: will this ever reject?
    return new Promise(r => this.server.close(r));
  }
}
<<<<<<< Updated upstream

function configureRoutes(app, clientDir, db) {
  // Server routes (take priority over client routing).
  app.post('/order/:drink?', handlers.order.drink);
  app.post('/led/blink-once', handlers.led.blinkOnce);

  app.get('/bottles', handlers.bottles.getAll(db));
  app.post('/bottles', handlers.bottles.add(db));
  app.get('/bottles/:id', handlers.bottles.get(db));
  app.post('/bottles/:id/refill', handlers.bottles.refill);

  app.get('/drinks', handlers.drinks.getAll(db));
  app.get('/drinks/:id', handlers.drinks.get(db));
  app.post('/drinks', handlers.drinks.add(db));
  app.post('/drinks/:id/pour', handlers.drinks.pour(db));

  app.post('/admin/pins/:pin/fire', handlers.admin.pins.fire);
  app.post('/admin/database/init', handlers.admin.database.init(db));

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
=======
>>>>>>> Stashed changes
