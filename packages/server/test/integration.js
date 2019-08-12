#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

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
  },
};

const BASE = `http://localhost:${serverConfig.port}`;

// ---

tap.test('start test server', async () => {
  fs.unlinkSync(serverConfig.sqlite3.filename);

  server = new Server(serverConfig);

  await server.start();
});

tap.beforeEach(async () => {
  console.log('droppin');
  await new Promise(r => request({
    method: 'POST',
    uri: `${BASE}/admin/database/drop`
  }, (err, res, body) => {
    r();
  }));

  console.log('done dropping!')

  await new Promise(r => request({
    method: 'POST',
    uri: `${BASE}/admin/database/init`
  }, (err, res, body) => {
    r();
  }));

  console.log('done init!')
});

tap.teardown(() => {
  if (server) {
    return server.stop();
  }
});

tap.test('GET /bottles', t => {
  request({
    method: 'GET',
    uri: `${BASE}/bottles`
  }, (error, response, body) => {
    const data = JSON.parse(body);
    t.match(Object.keys(data).length, 1);
    t.match(data.bottles instanceof Array, true);

    const firstBottle = data.bottles[0];
    t.match(Object.keys(firstBottle).length, 5);
    t.match(typeof firstBottle.id, 'number');
    t.match(typeof firstBottle.name, 'string');
    t.match(typeof firstBottle.max_liters, 'number');
    t.match(typeof firstBottle.current_liters, 'number');
    t.match(typeof firstBottle.attached_device_id, 'number');

    t.end();
  });
});

tap.test('GET /bottles/:id', t => {
  request({
    method: 'GET',
    uri: `${BASE}/bottles/1`
  }, (error, response, body) => {
    const data = JSON.parse(body);

    t.match(Object.keys(data).length, 5);
    t.match(typeof data.id, 'number');
    t.match(typeof data.name, 'string');
    t.match(typeof data.max_liters, 'number');
    t.match(typeof data.current_liters, 'number');
    t.match(typeof data.attached_device_id, 'number');

    t.end();
  });
});
