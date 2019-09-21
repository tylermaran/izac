const bottle = require('./bottle');

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
