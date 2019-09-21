exports.add = (sqlite3_db, name) => new Promise((resolve, reject) => {
  const sql = `INSERT INTO device_type (name) VALUES (?);`;
  const params = [ name ];

  sqlite3_db.run(sql, params, function(error) {
    return error ? reject(error) : resolve(this);
  });
});

exports.getByName = (sqlite3_db, name) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM device_type WHERE name=?', [
    name
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

exports.getById = (sqlite3_db, id) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM device_type WHERE id=?', [
    id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));
