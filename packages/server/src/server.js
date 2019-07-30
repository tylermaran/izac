const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const handlers = require('./handlers');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const pins = require('./pins');
const bottleDB = require('./db/bottle');

module.exports = class Server {
  constructor(options) {
    this.server;
    this.port = options.port;
    this.sqlite3_db = new sqlite3.Database(options.sqlite3.filename);

    this.app = express();

    this.app.use(cors(options.cors));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    configureRoutes(this.app, options.client.baseDir, this.sqlite3_db);
  }

  async start() {
    await initDatabase(this.sqlite3_db);
    return new Promise(r => this.servqer = this.app.listen(this.port, r));
  }

  async stop() {
    return new Promise(r => this.server.close(r));
  }
}

async function initDatabase(sqlite3_db) {
  await bottleDB.create(sqlite3_db);
  await handlers.drinks.initDatabase(sqlite3_db);

  // >>>> bottles (liquor)
  await bottleDB.add(
    sqlite3_db, "rum", 1.75, 'air', pins.bottle_rum); // id=1
  await bottleDB.add(
    sqlite3_db, "gin", 1.75, 'air', pins.bottle_gin); // id=2
  await bottleDB.add(
    sqlite3_db, "vodka", 1.75, 'air', pins.bottle_vodka); // id=3
  await bottleDB.add(
    sqlite3_db, "scotch", 1.75, 'air', pins.bottle_scotch); // id=4
  await bottleDB.add(
    sqlite3_db, "irish whisky", 1.75, 'air', pins.bottle_irish_whisky); // id=5
  await bottleDB.add(
    sqlite3_db, "tequila", 1.75, 'air', pins.bottle_tequila); // id=6
  await bottleDB.add(
    sqlite3_db, "burbon", 1.75, 'air', pins.bottle_burbon); // id=7

  // >>>> bottles (mixers)
  await bottleDB.add(
    sqlite3_db, "coke", 2, 'peristaltic',
    pins.bottle_coke, pins.bottle_coke_reverse); // id=8
  await bottleDB.add(
    sqlite3_db, "ginger ale", 2, 'peristaltic',
    pins.bottle_ginger_ale, pins.bottle_ginger_ale_reverse); // id=9
  await bottleDB.add(
    sqlite3_db, "tonic", 2, 'peristaltic',
    pins.bottle_tonic, pins.bottle_tonic_reverse); // id=10

  await bottleDB.add(
    sqlite3_db, "lemon lime", 2, 'air', pins.bottle_lemon_lime); // id=11
  await bottleDB.add(
    sqlite3_db, "cranberry", 3.78541, 'air', pins.bottle_cranberry); // id=12


  const four_oz_in_liters = 0.118294;
  const shot_in_liters = 0.044;
  const one_shot_chaser = four_oz_in_liters - shot_in_liters;

  // >>>> drinks (RUM id=1)
  await handlers.drinks.db.add(sqlite3_db, "Rum (neat)", [
    { bottle_id: "1",  liters: shot_in_liters }
  ]);

  await handlers.drinks.db.add(sqlite3_db, "Rum Lemon-Lime", [
    { bottle_id: "1",  liters: shot_in_liters },
    { bottle_id: "12", liters: one_shot_chaser } //  - 0.044 =
  ]);

  await handlers.drinks.db.add(sqlite3_db, "Rum & Coke", [
    { bottle_id: "1",  liters: shot_in_liters },
    { bottle_id: "12", liters: one_shot_chaser }
  ]);

  // >>>> drinks (Gin id=2)
  await handlers.drinks.db.add(sqlite3_db, "Gin (neat)", [
    { bottle_id: "2",  liters: shot_in_liters }
  ]);

  await handlers.drinks.db.add(sqlite3_db, "Gin & Ginger Ale", [
    { bottle_id: "2",  liters: shot_in_liters },
    { bottle_id: "9",  liters: one_shot_chaser }
  ]);

  // >>>> drinks (VODKA id=3)
  await handlers.drinks.db.add(sqlite3_db, "Vodka (neat)", [
    { bottle_id: "3",  liters: shot_in_liters }
  ]);

  await handlers.drinks.db.add(sqlite3_db, "Vodka Tonic", [
    { bottle_id: "3", liters: shot_in_liters },
    { bottle_id: "10", liters: one_shot_chaser }
  ]);

  await handlers.drinks.db.add(sqlite3_db, "Vodka Cranberry", [
    { bottle_id: "3", liters: shot_in_liters },
    { bottle_id: "11", liters: one_shot_chaser }
  ]);

  // >>> drinks (SCOTCH id=4)
  await handlers.drinks.db.add(sqlite3_db, "Scotch (neat)", [
    { bottle_id: "4",  liters: shot_in_liters }
  ]);

  // >>> drinks (Irish_Whisky id=5)
  await handlers.drinks.db.add(sqlite3_db, "Irish Whisky (neat)", [
    { bottle_id: "5",  liters: shot_in_liters }
  ]);

  // >>> drinks ("tequila" id=6)
  await handlers.drinks.db.add(sqlite3_db, "Tequila (neat)", [
    { bottle_id: "6",  liters: shot_in_liters }
  ]);

  // >>> drinks ("burbon" id=7)
  await handlers.drinks.db.add(sqlite3_db, "Burbon (neat)", [
    { bottle_id: "7",  liters: shot_in_liters }
  ]);

}

function configureRoutes(app, clientDir, sqlite3_db) {
  // Server routes (take priority over client routing).
  app.post('/order/:drink?', handlers.order.drink);
  app.post('/led/blink-once', handlers.led.blinkOnce);

  app.get('/bottles', handlers.bottles.getAll(sqlite3_db));
  app.post('/bottles', handlers.bottles.add(sqlite3_db));
  app.get('/bottles/:id', handlers.bottles.get(sqlite3_db));
  app.post('/bottles/:id/refill', handlers.bottles.refill);

  app.get('/drinks', handlers.drinks.getAll(sqlite3_db));
  app.get('/drinks/:id', handlers.drinks.get(sqlite3_db));
  app.post('/drinks', handlers.drinks.add(sqlite3_db));
  app.post('/drinks/:id/pour', handlers.drinks.pour(sqlite3_db));

  app.post('/admin/pins/:pin/fire', handlers.admin.pins.fire);

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
