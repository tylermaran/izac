const create_drink = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS drink (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

const create_drink_ingredient = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS drink_pour (
     drink_id INTEGER NOT NULL,
     bottle_id INTEGER NOT NULL,
     liters REAL NOT NULL,
     FOREIGN KEY (drink_id) REFERENCES drink(id),
     FOREIGN KEY (bottle_id) REFERENCES bottle(id)
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

exports.create = (sqlite3_db) => Promise.all([
  create_drink(sqlite3_db),
  create_drink_ingredient(sqlite3_db)
]);

exports.getPoursForDrink = (sqlite3_db, drink_id) => new Promise((resolve, reject) =>
  sqlite3_db.all('SELECT * FROM drink_pour WHERE drink_id=?', [
    drink_id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

exports.getAll = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.all('SELECT * FROM drink', [], function(error, rows) {
    return error ? reject(error) : resolve(rows)
  }));

exports.getById = (sqlite3_db, id) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM drink WHERE id=?', [
    id
  ], function(error, result) {
    error ? reject(error) : resolve(result);
  }));

/**

   pours = [
   { "bottle_id": <int>, "liters": <float> },
   { "bottle_id": <int>, "liters": <float> }
   ]

 */
exports.add = async (sqlite3_db, name, pours) => {

  //
  // TODO: run these statements in batches
  //

  const drink_statement = await new Promise((resolve, reject) =>
    sqlite3_db.run(`INSERT INTO drink (name) VALUES (?);`, [
      name
    ], function(error) {
      return error ? reject(error) : resolve(this);
    }));

  const drinkID = drink_statement.lastID;
  const pour_statements = [];

  for (let i = 0; i < pours.length; i++) {
    const bottleID = pours[i].bottle_id
    const liters = pours[i].liters;

    pour_statements.push(await new Promise((resolve, reject) =>
      sqlite3_db.run(`INSERT INTO drink_pour (
        drink_id, bottle_id, liters
      ) VALUES (?, ?, ?);`, [
        drinkID, bottleID, liters
      ], function(error) {
        return error ? reject(error) : resolve(this);
      })));
  }

  return { drink_statement, pour_statements };
}
