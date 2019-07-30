const bottleDB = require('../db/bottle');

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
    const bottle = await bottleDB.getById(sqlite3_db, id);
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
    const bottles = await bottleDB.getAll(sqlite3_db);
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
    // TODO: this is broken with the new add syntax. Fix me when we have
    // a UI that can add new drinks.
    const statement = await bottleDB.add(sqlite3_db, name, max_liters);
    const bottle = await bottleDB.getById(sqlite3_db, statement.lastID);
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
    const bottle = await bottleDB.getById(sqlite3_db, id);
    res.json(bottle);
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};
