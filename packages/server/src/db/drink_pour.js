exports.create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS drink_pour (
     drink_id INTEGER NOT NULL,
     bottle_id INTEGER NOT NULL,
     liters REAL NOT NULL,
     FOREIGN KEY (drink_id) REFERENCES drink(id),
     FOREIGN KEY (bottle_id) REFERENCES bottle(id)
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

exports.drop = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`DROP TABLE IF EXISTS drink_pour;`, [], function(error) {
    return error ? reject(error) : resolve(this);
  }));

exports.getPoursForDrink = (sqlite3_db, drink_id) => new Promise((resolve, reject) =>
  sqlite3_db.all('SELECT * FROM drink_pour WHERE drink_id=?', [
    drink_id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

exports.add = (sqlite3_db, drinkID, bottleID, liters) => new Promise((resolve, reject) =>
  sqlite3_db.run(`INSERT INTO drink_pour (
        drink_id, bottle_id, liters
      ) VALUES (?, ?, ?);`, [
        drinkID, bottleID, liters
      ], function(error) {
        return error ? reject(error) : resolve(this);
      }));
