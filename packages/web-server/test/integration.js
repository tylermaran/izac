#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const tap = require('tap');
const request = require('request');

const API = require('barbot-api');
const Server = require('../src/server');
const config = require('../config');

const seed = require('../src/db/admin/seed');
const drop = require('../src/db/admin/drop');



// ---

let server;
const baseURL = `http://localhost:${config.port}`;
const api = new API(baseURL);

// ---


tap.only('start test server', async () => {
  try {  fs.unlinkSync(config.sqlite3.filename); } catch(e) {}

  server = new Server(config);

  await drop(server.db);
  await seed(server.db);

  await server.start();
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
  t.match(Object.keys(firstBottle).length, 7);
  t.match(typeof firstBottle.id, 'number');
  t.match(typeof firstBottle.name, 'string');
  t.match(typeof firstBottle.max_liters, 'number');
  t.match(typeof firstBottle.fill, 'number');
  t.match(typeof firstBottle.device_id, 'number');
  t.match(typeof firstBottle.created_at, 'string');
  t.match(typeof firstBottle.updated_at, 'string');
});

tap.test('GET /bottles/:id', async (t) => {
  const data = await api.bottle.one(1);
  t.match(Object.keys(data).length, 7);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(typeof data.max_liters, 'number');
  t.match(typeof data.fill, 'number');
  t.match(typeof data.device_id, 'number');
  t.match(typeof data.created_at, 'string');
  t.match(typeof data.updated_at, 'string');
});

tap.test('POST /bottles/:id/refill', async (t) => {
  const drink = await api.drink.one(1);

  // grab the first bottle ID from this drink for this test.
  const bottleId = drink.pours[0].bottle_id;

  // start at a clean slate with this bottle
  await api.bottle.refill(bottleId);

  // fetch the bottle from the database, and capture it's max liters
  const bottle = await api.bottle.one(bottleId);
  const maxLiters = bottle.max_liters;

  // verify that our bottle fill level is "1"
  //
  // --> fill of "1" means the bottle is FULL, 0 = empty
  //
  t.match(bottle.fill, 1);

  // pour out a lil' drink for our homies
  await api.drink.pour(drink.id);

  const updatedBottle = await api.bottle.one(bottleId);

  t.match(updatedBottle.fill < 1, true);

  await api.bottle.refill(bottleId);
  const refilledBottle = await api.bottle.one(bottleId);
  t.match(refilledBottle.fill, 1);
});


//
// Drinks
//

tap.only('GET /drinks', async (t) => {
  const data = await api.drink.list();

  t.match(data.drinks.length, 20);

  for (let drink of data.drinks) {

    t.match(Object.keys(drink).length, 5);

    const { id, name, pours } = drink;

    t.match(typeof id, 'number');
    t.match(typeof name, 'string');
    t.match(pours instanceof Array, true);

    for (let pour of pours) {
      t.match(Object.keys(pour).length, 7);


      t.match(typeof pour.bottle_id, 'number');
      t.match(typeof pour.liters, 'number');
    }
  }
});

tap.test('GET /drinks/:id', async (t) => {
  const data = await api.drink.one(1);

  t.match(Object.keys(data).length, 5);
  t.match(typeof data.id, 'number');
  t.match(typeof data.name, 'string');
  t.match(data.pours instanceof Array, true);

  for (let pour of data.pours) {
    t.match(Object.keys(pour).length, 8);
    t.match(typeof pour.bottle_id, 'number');
    t.match(typeof pour.liters, 'number');
  }
});

tap.test('POST /drinks/:id/pour', async (t) => {

  const drink = await api.drink.one(1);

  // we're only concerned about ONE bottle in a drink for this test.
  const pour = drink.pours[0];

  // start at a clean slate with this bottle
  await api.bottle.refill(pour.bottle_id);

  // fetch the bottle from the database, and capture it's max liters
  const bottle = await api.bottle.one(pour.bottle_id);

  const maxLiters = bottle.max_liters;

  // verify that our bottle fill level is "1"
  //
  // --> fill of "1" means the bottle is FULL, 0 = empty
  //
  t.match(bottle.fill, 1);

  // pour out a lil' drink for our homies
  await api.drink.pour(drink.id);

  // calculate what we think the new bottle fill level should be
  // before asking what it is in the database :)
  const newFillLevel = (bottle.max_liters - pour.liters) / bottle.max_liters;

  // ok ask now lol
  const updatedBottle = await api.bottle.one(pour.bottle_id);

  // assert that the bottle has been drained the amount specified
  // in the pour (re-calculate the fill variable)

  t.match(updatedBottle.fill, newFillLevel);

});
