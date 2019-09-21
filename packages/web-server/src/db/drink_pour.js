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
