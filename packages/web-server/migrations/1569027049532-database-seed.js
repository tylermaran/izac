const path = require('path');
const Database = require('../src/db');
const config = require('../config');
const { DEVICE_TYPES, DEVICE_ACTIONS } = require('../src/robots');
const seed = require('../src/db/admin/seed');
const drop = require('../src/db/admin/drop');

const db = new Database(config.sqlite3.filename);

const {
  DeviceType, DeviceAction, Device, Pin,
  Bottle, Pour, Drink, DrinkPour
} = db.models;

module.exports.up = function (next) {
  (async function() {
    try {
      await seed(db);
      next();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}

module.exports.down = function (next) {
  (async function() {
    try {
      await drop(db);
      next();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
