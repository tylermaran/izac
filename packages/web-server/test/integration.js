#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const API = require('barbot-api');

const tap = require('tap');
const request = require('request');

const Server = require('../src/server');

// ---

const cwd = process.cwd(); // store all files we create in the cwd.

let server;

const serverConfig = {
  port: process.env.PORT || 7357, // 7357 P0R7
  cors: {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type']
  },
  sqlite3: {
    filename: process.env.SQLITE3_DB_PATH || path.join(cwd, 'test.db.sqlite3')
  },
  client: {
    // @TODO:
    //
    // Not strictly used for tests at the moment. When we start doing UI
    // tests / etc. we will want to change this so we can "render" the
    // react views.
    //
    baseDir: path.join(__dirname)
  }
};

const baseURL = `http://localhost:${serverConfig.port}`;

const api = new API(baseURL);

// ---

tap.only('start test server', async () => {
  fs.unlinkSync(serverConfig.sqlite3.filename);

  server = new Server(serverConfig);

  await server.start();
});

tap.beforeEach(async () => {
  await new Promise(r => request({
    method: 'POST',
    uri: `${baseURL}/admin/database/drop`
  }, (err, res, body) => {
    r();
  }));

  await new Promise(r => request({
    method: 'POST',
    uri: `${baseURL}/admin/database/init`
  }, (err, res, body) => {
    r();
  }));
});

tap.teardown(() => {
  if (server) {
    return server.stop();
  }
});

//
// Bottles
//

tap.test('GET /bottles', async (t) => {
  const data = await api.bottle.list();
  t.match(Object.keys(data).length, 1);
  t.match(data.bottles instanceof Array, true);

  const firstBottle = data.bottles[0];
  t.match(Object.keys(firstBottle).length, 5);
  t.match(typeof firstBottle.id, 'number');
  t.match(typeof firstBottle.name, 'string');
  t.match(typeof firstBottle.max_liters, 'number');
  t.match(typeof firstBottle.current_liters, 'number');
  t.match(typeof firstBottle.attached_device_id, 'number');
});

tap.test('GET /bottles/:id', async (t) => {
  const data = await api.bottle.one(1);
  t.match(Object.keys(data).length, 5);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(typeof data.max_liters, 'number');
  t.match(typeof data.current_liters, 'number');
  t.match(typeof data.attached_device_id, 'number');
});

tap.test('POST /bottles', async (t) => {
  const data = await api.bottle.add('jayskie', 2, 1);
  t.match(Object.keys(data).length, 5);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(typeof data.max_liters, 'number');
  t.match(typeof data.current_liters, 'number');
  t.match(data.attached_device_id, 1);
});

tap.test('POST /bottles/:id/refill', async (t) => {

  const MAX_LITERS = 2.0;

  const bottle = await api.bottle.add(
    'jayskie',  // bottle name
    MAX_LITERS, // max liters for bottle
    1           // attached device id
  );

  // refilling at this moment should be OK (noop).
  const data = await api.bottle.refill(bottle.id);

  t.match(Object.keys(data).length, 5);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(typeof data.max_liters, 'number');
  t.match(data.max_liters, MAX_LITERS);
  t.match(typeof data.current_liters, 'number');
  t.match(data.attached_device_id, 1);

  // ensure refill works on bottles we've drined a lil'
  const newDrink = await api.drink.add('jayskie-club-mate', [
    { bottle_id: bottle.id, liters: 0.5 } // "pour 0.5 liters from bottle
  ]);

  await api.drink.pour(newDrink.id);

  const updatedBottle = await api.bottle.one(bottle.id);

  t.match(updatedBottle.max_liters !== updatedBottle.current_liters, true);
  t.match(updatedBottle.max_liters - 0.5, updatedBottle.current_liters);

  await api.bottle.refill(bottle.id);
  const refilledBottle = await api.bottle.one(bottle.id);
  t.match(refilledBottle.max_liters, refilledBottle.current_liters);
});


//
// Drinks
//

tap.test('GET /drinks', async (t) => {
  const data = await api.drink.list();

  t.match(data.drinks.length, 8);

  for (let drink of data.drinks) {

    t.match(Object.keys(drink).length, 3);

    const { id, name, pours } = drink;

    t.match(typeof id, 'number');
    t.match(typeof name, 'string');
    t.match(pours instanceof Array, true);

    for (let pour of pours) {
      t.match(Object.keys(pour).length, 2);
      t.match(typeof pour.bottle_id, 'number');
      t.match(typeof pour.liters, 'number');
    }
  }
});

tap.test('GET /drinks/:id', async (t) => {
  const data = await api.drink.one(1);

  t.match(Object.keys(data).length, 3);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(data.pours instanceof Array, true);

  for (let pour of data.pours) {
    t.match(Object.keys(pour).length, 2);
    t.match(typeof pour.bottle_id, 'number');
    t.match(typeof pour.liters, 'number');
  }
});

tap.test('POST /drinks', async (t) => {
  const data = await api.drink.add('jayskie-club-mate', [
    { bottle_id: 1, liters: 0.5 }
  ]);

  t.match(Object.keys(data).length, 3);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(data.pours instanceof Array, true);

  for (let pour of data.pours) {
    t.match(Object.keys(pour).length, 2);
    t.match(typeof pour.bottle_id, 'number');
    t.match(typeof pour.liters, 'number');
  }
});

tap.test('POST /drinks/:id/pour', async (t) => {

  const bottleA = await api.bottle.one(1);
  const bottleB = await api.bottle.one(2);

  t.match(bottleA.max_liters, bottleA.current_liters);
  t.match(bottleB.max_liters, bottleB.current_liters);

  const newDrink = await api.drink.add('jayskie-club-mate', [
    { bottle_id: bottleA.id, liters: 0.5 },
    { bottle_id: bottleB.id, liters: 0.25 }
  ]);

  const data = await api.drink.pour(newDrink.id);

  t.match(Object.keys(data).length, 3);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(data.pours instanceof Array, true);

  for (let pour of data.pours) {
    t.match(Object.keys(pour).length, 2);
    t.match(typeof pour.bottle_id, 'number');
    t.match(typeof pour.liters, 'number');
  }

  // check that the bottle level decreased by the amount we've set
  const pouredBottleA = await api.bottle.one(1);
  const pouredBottleB = await api.bottle.one(2);

  t.match(pouredBottleA.max_liters - 0.5,
          pouredBottleA.current_liters);

  t.match(pouredBottleB.max_liters - 0.25,
          pouredBottleB.current_liters);
});
