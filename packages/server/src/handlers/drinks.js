const bottles = require('./bottles');

/**
   Database handlers @todo: move to new file once stable
 */

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

const create = (sqlite3_db) => Promise.all([
  create_drink(sqlite3_db),
  create_drink_ingredient(sqlite3_db)
])

const getPoursForDrink = (sqlite3_db, drink_id) => new Promise((resolve, reject) =>
  sqlite3_db.all('SELECT * FROM drink_pour WHERE drink_id=?', [
    drink_id
  ], function(error, result) {
    return error ? reject(error) : resolve(result);
  }));

const getAll = (sqlite3_db) => new Promise((resolve, reject) =>
  sqlite3_db.all('SELECT * FROM drink', [], function(error, rows) {
    return error ? reject(error) : resolve(rows)
  }));

const getById = (sqlite3_db, id) => new Promise((resolve, reject) =>
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
const add = async (sqlite3_db, name, pours) => {

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
    pour_statements.push(await new Promise((resolve, reject) =>
      sqlite3_db.run(`INSERT INTO drink_pour (
        drink_id, bottle_id, liters
      ) VALUES (?, ?, ?);`, [
        drinkID, pours[i].bottle_id, pours[i].liters
      ], function(error) {
        return error ? reject(error) : resolve(this);
      })));
  }

  return { drink_statement, pour_statements };
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
    const drink = await getById(sqlite3_db, id);

    if (!drink) {
      res.status(404).json({ error: 'drink not found' });
      return;
    }

    const pours = await getPoursForDrink(sqlite3_db, drink.id);
    if (!pours) {
      res.status(404).json({ error: `pours for drink ${drink.id} not found` });
      return;
    }

    res.status(200).json({
      id: drink.id,
      name: drink.name,
      pours: pours.map(pour => ({
        bottle_id: pour.bottle_id,
        liters: pour.liters
      }))
    });

  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.getAll = (sqlite3_db) => async (req, res) => {
  try {
    const data = {
      drinks: []
    };

    const drinks = await getAll(sqlite3_db);

    if (!drinks) {
      res.status(404).json({ error: 'drink not found' });
      return;
    }

    for (let i = 0; i < drinks.length; i++) {
      const drink = drinks[i];

      const pours = await getPoursForDrink(sqlite3_db, drink.id);
      if (!pours) {
        res.status(404).json({
          error: `pours for drink (id=${drink.id}) not found`
        });
        return;
      }

      const entry = Object.assign({}, drink, {
        pours: pours.map(pour => ({
          bottle_id: pour.bottle_id,
          liters: pour.liters
        }))
      });
      data.drinks.push(entry);
    }

    res.status(200).json(data);

  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.add = (sqlite3_db) => async (req, res) => {
  const invalidations = [];
  const { name, pours } = req.body;

  if (typeof name !== 'string') {
    invalidations.push("name isn't of type string");
  }

  if (!(pours instanceof Array)) {
    invalidations.push('pours is not an array');
  } else {
    pours.forEach(pour => {
      if (typeof pour.bottle_id !== 'number') {
        invalidations.push("pour is missing a bottle id");
      }
      if (typeof pour.liters !== 'number') {
        invalidations.push("pour is missing a liters amount");
      }
    });
  }

  if (invalidations.length > 0) {
    res.status(400).json({ errors: invalidations });
    return;
  }

  try {
    const add_result = await add(sqlite3_db, name, pours);
    const drink_id = add_result.drink_statement.lastID;
    const drink = await getById(sqlite3_db, drink_id);
    const db_pours = await getPoursForDrink(sqlite3_db, drink.id);

    res.status(200).json(Object.assign({}, drink, {
      pours: db_pours.map(pour => ({
        bottle_id: pour.bottle_id,
        liters: pour.liters
      }))
    }));

  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.pour = (sqlite3_db) => async (req, res) => {

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
    const drink = await getById(sqlite3_db, id);
    if (!drink) {
      res.status(404).json({ error: 'drink not found' });
      return;
    }

    const pours = await getPoursForDrink(sqlite3_db, id);
    if (pours.length <= 0) {
      res.status(404).json({
        error: 'pours for drink (id=${drink.id}) not found'
      });
      return;
    }

    for (let i = 0; i < pours.length; i++) {
      const pour = pours[i];

      const bottle = await bottles.db.getById(sqlite3_db,
                                              pour.bottle_id);

      const new_bottle_liters = bottle.current_liters - pour.liters;

      await bottles.db.setBottleLevel(sqlite3_db,
                                      pour.bottle_id,
                                      new_bottle_liters);
    }

    res.status(200).json(Object.assign({}, drink, {
      pours: pours.map(pour => ({
        bottle_id: pour.bottle_id,
        liters: pour.liters
      }))
    }));

  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};
