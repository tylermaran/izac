const path = require('path');
const Database = require('../src/db');
const config = require('../config');

const { DeviceType } = require('../src/db/device_type');
const { DeviceAction } = require('../src/db/device_action');
const { Device } = require('../src/db/device');
const { Bottle } = require('../src/db/bottle');
const { Drink } = require('../src/db/drink');
const { DrinkPour } = require('../src/db/drink_pour');
const { Pin } = require('../src/db/pin');

const db = new Database(config.sqlite3.filename);

module.exports.up = function (next) {
  (async function() {
    try {
      await db.models.DeviceType.sync({ force: true });
      await db.models.DeviceAction.sync({ force: true });
      await db.models.Device.sync({ force: true });
      await db.models.Bottle.sync({ force: true });
      await db.models.Drink.sync({ force: true });
      await db.models.DrinkPour.sync({ force: true });
      await db.models.Pin.sync({ force: true });
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
      await db.models.DeviceType.drop();
      await db.models.DeviceAction.drop();
      await db.models.Device.drop();
      await db.models.Bottle.drop();
      await db.models.Drink.drop();
      await db.models.DrinkPour.drop();
      await db.models.Pin.drop();
      next();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
