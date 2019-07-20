/**
   Database handlers @todo: move to new file once stable
*/

exports.db = {}

const create = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.run(`CREATE TABLE IF NOT EXISTS bottle (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL,
     max_liters REAL NOT NULL,
     current_liters REAL NOT NULL
   );`, [], function(error) { // must use function as `this` is utilized in lib-sqlite3
     return error ? reject(error) : resolve(this);
   }));

const getAll = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.all('SELECT * FROM bottle', [], function(error, rows) {
    return error ? reject(error) : resolve(rows)
  }));

const getById = (sqlite3_db, id) => new Promise((resolve, reject) =>
  sqlite3_db.get('SELECT * FROM bottle WHERE id=?', [
    id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

const setBottleLevel = (sqlite3_db, bottle_id, new_liters) => new Promise((resolve, reject) =>
  sqlite3_db.run(`UPDATE bottle SET current_liters=? WHERE id=?`, [
    new_liters,
    bottle_id
  ], function(error) {
    return error ? reject(error) : resolve(this);
  }));

exports.db.setBottleLevel = setBottleLevel;

const add = (sqlite3_db, name, max_liters) => new Promise((resolve, reject) =>
  sqlite3_db.run(`INSERT INTO bottle (
    name, max_liters, current_liters
  ) VALUES (?, ?, ?);`, [
    name, max_liters, max_liters
  ], function(error) {
    return error ? reject(error) : resolve(this);
  }));

const refill = async (sqlite3_db, id) => {
  const bottle = await getById(sqlite3_db, id);

  return new Promise((resolve, reject) =>
    sqlite3_db.run(`UPDATE bottle SET current_liters=? WHERE id=?`, [
      bottle.max_liters, id
    ], function(error) {
      return error ? reject(error) : resolve(this);
    }));
}

exports.initDatabase = create;

/**
   @todo: move to new file once stable.
*/

exports.get = (sqlite3_db) => async (req, res) => {
  const invalidations = [];
  const { id } = req.params;

  if (typeof id !== 'string') {
    invalidations.push('missing required parameter id');
  }

  if (invalidations.length > 0) {
    res.status(400).json({ errors: invalidations });
    return;
  }

  try {
    const bottle = await getById(sqlite3_db, id);
    if (bottle) {
      res.status(200).json(bottle);
    } else {
      res.status(404).json({ error: 'not found' });
    }
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.getAll = (sqlite3_db) => async (req, res) => {
  try {
    const bottles = await getAll(sqlite3_db);
    if (bottles) {
      res.status(200).json({ bottles });
    } else {
      res.status(404).json({ error: 'not found' });
    }
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.add = (sqlite3_db) => async (req, res) => {
  const invalidations = [];
  const { name, max_liters } = req.body;

  if (typeof name !== 'string') {
    invalidations.push("name isn't of type string");
  }

  if (typeof max_liters !== 'number') {
    invalidations.push('max_liters is not a number');
  }

  if (invalidations.length > 0) {
    res.status(400).json({ errors: invalidations });
    return;
  }

  try {
    const statement = await add(sqlite3_db, name, max_liters);
    const bottle = await getById(sqlite3_db, statement.lastID);
    res.status(200).json(bottle);
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.refill = async (req, res) => {
  const invalidations = [];
  const { id } = req.params;

  if (typeof id !== 'string') {
    invalidations.push('missing required parameter id');
  }

  if (invalidations.length > 0) {
    res.status(400).json({ errors: invalidations });
    return;
  }

  try {
    const bottle = await getById(sqlite3_db, id);
    res.json(bottle);
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};
