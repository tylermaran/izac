const pour = require('./drink_pour');

exports.create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS drink (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
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

  // TODO: run these statements in a single transaction

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
    pour_statements.push(await pour.add(sqlite3_db, drinkID, bottleID, liters));
  }

  return { drink_statement, pour_statements };
}
