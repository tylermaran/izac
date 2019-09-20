const device = require('./device');
const Sequelize = require('sequelize');
const { Device } = require('./device');
const { DeviceAction } = require('./device_action');

class Pin extends Sequelize.Model {}

exports.Pin = Pin;

exports.init = (sequelize) => Pin.init({
  physical_pin_number: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true
  },
  device_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: Device, key: 'id' }
  },
  attached_device_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: Device, key: 'id' }
  },
  device_action_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: DeviceAction, key: 'id' }
  }
}, {
  sequelize,
  modelName: 'pin'
});


// device_id  ---------------------------- device this pin belongs to
// physical_pin_number ------------------- physical pin number on device
// attached_device_id -------------------- what device is attached to the pin?
exports.create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS pin (
     id INTEGER PRIMARY KEY,
     device_id INTEGER,
     physical_pin_number INTEGER NOT NULL UNIQUE,
     attached_device_id INTEGER,
     device_action_id INTEGER,
     FOREIGN KEY(device_id) REFERENCES device(id),
     FOREIGN KEY(attached_device_id) REFERENCES device(id),
     FOREIGN KEY(device_action_id) REFERENCES device_action(id)
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

exports.drop = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`DROP TABLE IF EXISTS pin;`, [], function(error) {
     return error ? reject(error) : resolve(this);
   }));

exports.add = (sqlite3_db, device_id, physical_pin_number, attached_device_id, device_action_id) => new Promise((resolve, reject) => {

  const sql = `INSERT INTO pin (
    device_id, physical_pin_number, attached_device_id, device_action_id
  ) VALUES (?, ?, ?, ?);`;

  const params = [ device_id, physical_pin_number, attached_device_id, device_action_id ];

  sqlite3_db.run(sql, params, function(error) {
    return error ? reject(error) : resolve(this);
  });
});

exports.getAllForAttachedDevice = (sqlite3_db, attached_device_id) =>
  new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pin WHERE attached_device_id = ?';
    const params = [ attached_device_id ];
    sqlite3_db.all(sql, params, function(error, rows) {
      return error ? reject(error) : resolve(rows)
    });
  });
