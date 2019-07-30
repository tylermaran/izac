exports.create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS bottle (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL,
     max_liters REAL NOT NULL,
     current_liters REAL NOT NULL,
     pump_type TEXT NOT NULL,
     rpi_pin_1 INTEGER NOT NULL UNIQUE,
     rpi_pin_2 INTEGER
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
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

exports.add = (sqlite3_db, name, max_liters, pump_type, rpi_pin_1, rpi_pin_2) => new Promise((resolve, reject) => {

  const sql = `INSERT INTO bottle (
    name, max_liters, current_liters, pump_type, rpi_pin_1, rpi_pin_2
  ) VALUES (?, ?, ?, ?, ?, ?);`;

  const params = [
    name, max_liters, max_liters, pump_type, rpi_pin_1, rpi_pin_2
  ];

  console.log(sql);
  console.log(params);

  sqlite3_db.run(sql, params, function(error) {
    return error ? reject(error) : resolve(this);
  });
});

exports.refill = async (sqlite3_db, id) => {
  const bottle = await getById(sqlite3_db, id);

  return new Promise((resolve, reject) =>
    sqlite3_db.run(`UPDATE bottle SET current_liters=? WHERE id=?`, [
      bottle.max_liters, id
    ], function(error) {
      return error ? reject(error) : resolve(this);
    }));
}
