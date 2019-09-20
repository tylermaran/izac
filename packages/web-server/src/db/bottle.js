const Sequelize = require('sequelize');
const { Device } = require('./device');

class Bottle extends Sequelize.Model {}

exports.Bottle = Bottle;

exports.init = (sequelize) => Bottle.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  max_liters: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  current_liters: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  attached_device_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: Device, key: 'id' }
  }
}, {
  sequelize,
  modelName: 'bottle'
});

exports.create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS bottle (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL,
     max_liters REAL NOT NULL,
     current_liters REAL NOT NULL,
     attached_device_id INTEGER,
     FOREIGN KEY(attached_device_id) REFERENCES device(id)
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

exports.drop = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`DROP TABLE IF EXISTS bottle;`, [], function(error) {
    return error ? reject(error) : resolve(this);
  }));

exports.getAll = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.all('SELECT * FROM bottle', [], function(error, rows) {
    return error ? reject(error) : resolve(rows)
  }));

exports.getById = (sqlite3_db, id) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM bottle WHERE id=?', [
    id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

exports.setBottleLevel = (sqlite3_db, bottle_id, new_liters) => new Promise((resolve, reject) =>
  sqlite3_db.run(`UPDATE bottle SET current_liters=? WHERE id=?`, [
    new_liters,
    bottle_id
  ], function(error) {
    return error ? reject(error) : resolve(this);
  }));

exports.add = (sqlite3_db, name, max_liters, attached_device_id) => new Promise((resolve, reject) => {

  const sql = `INSERT INTO bottle (
    name, max_liters, current_liters, attached_device_id
  ) VALUES (?, ?, ?, ?);`;

  const params = [
    name, max_liters, max_liters, attached_device_id
  ];

  sqlite3_db.run(sql, params, function(error) {
    return error ? reject(error) : resolve(this);
  });
});

exports.refill = async (sqlite3_db, id) => {
  const bottle = await exports.getById(sqlite3_db, id);

  return new Promise((resolve, reject) =>
    sqlite3_db.run(`UPDATE bottle SET current_liters=? WHERE id=?`, [
      bottle.max_liters, id
    ], function(error) {
      return error ? reject(error) : resolve(this);
    }));
}
