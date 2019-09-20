exports.create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS device_action (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL UNIQUE
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

exports.drop = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`DROP TABLE IF EXISTS device_action;`, [], function(error) {
    return error ? reject(error) : resolve(this);
  }));

exports.add = (sqlite3_db, name) => new Promise((resolve, reject) => {
  const sql = `INSERT INTO device_action (name) VALUES (?);`;
  const params = [ name ];

  sqlite3_db.run(sql, params, function(error) {
    return error ? reject(error) : resolve(this);
  });
});

exports.getByName = (sqlite3_db, name) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM device_action WHERE name=?', [
    name
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));


exports.getById = (sqlite3_db, id) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM device_action WHERE id=?', [
    id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));
