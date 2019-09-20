const bottle = require('./bottle');
const Sequelize = require('sequelize');
const { DeviceType } = require('./device_type');

class Device extends Sequelize.Model {}

exports.Device = Device;

exports.init = (sequelize) => Device.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  device_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: DeviceType, key: 'id' }
  }
}, {
  sequelize,
  modelName: 'device'
});


exports.create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS device (
     id INTEGER PRIMARY KEY,
     device_type_id INTEGER,
     name TEXT NOT NULL UNIQUE,
     FOREIGN KEY(device_type_id) REFERENCES device_type(id)
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

exports.drop = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`DROP TABLE IF EXISTS device;`, [], function(error) {
    return error ? reject(error) : resolve(this);
  }));

exports.add = (sqlite3_db, device_type_id, name) => new Promise((resolve, reject) => {
  const sql = `INSERT INTO device (device_type_id, name) VALUES (?, ?);`;
  const params = [ device_type_id, name ];

  sqlite3_db.run(sql, params, function(error) {
    return error ? reject(error) : resolve(this);
  });
});

exports.getById = (sqlite3_db, id) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM device WHERE id=?', [
    id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

exports.getByName = (sqlite3_db, name) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM device WHERE name=?', [
    name
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

exports.getByBottleID = async (sqlite3_db, bottle_id) => {
  const b = await bottle.getById(sqlite3_db, bottle_id);

  return exports.getById(sqlite3_db, b.attached_device_id);
}
