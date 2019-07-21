const rpio = require('rpio');
const bottles = require('./bottles');
const robots = require('../robots');

/**
   Database handlers @todo: move to new file once stable
 */

exports.db = {};

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
]);

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

exports.db.add = add;

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
      res.status(404).json({ error: 'no drinks not found' });
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

function get_peristaltic_bottle_pour_duration(liter_pour) {
  // our mesurement of what a shot is. This is a ratio that represents how
  // long it takes to pour a shot with the peristaltic pumps.
  const measurement = {
    liters: 0.044,
    full_bottle_pour_duration: 2000
  };

  // adjust the duration from of measurement to the passed in liters we're pouring
  // this time is ONLY valid for full bottles
  const pour_duration =
    (measurement.full_bottle_pour_duration *  liter_pour) / measurement.liters;

  return Math.round(pour_duration);
}

function get_air_bottle_pour_duration(liter_pour, current_bottle_fill, full_bottle_fill) {
  // with a full bottle (1.75L) of liquor, it takes ~2 seconds to pour
  // a shot (0.044L) out of the machine with our air pumps. We use
  // this ratio to calculate the time it takes other volumes to pour
  // out adjusted for bottle air pressure.

  // how long does it take to pour a shot with a FULL bottle of liquor with
  // our air pumps?
  const measurement = {
    liters: 0.044,
    full_bottle_pour_duration: 2000,
    near_empty_bottle_pour_duration: 5000
  };

  // adjust the duration from of measurement to the passed in liters we're pouring
  // this time is ONLY valid for full bottles
  const full_bottle_duration =
    (measurement.full_bottle_pour_duration * liter_pour) / measurement.liters;

  console.log('>>> full bottle pour duration:', full_bottle_duration);

  const fill_ratio = current_bottle_fill / full_bottle_fill;

  console.log('>>> fill_ratio', fill_ratio)

  // A ratio that we can adjust. The larger the number, the higher the
  // pour duration will be when we get down to the bottom of the bottle.
  const skew = 30;

  // adjust the pour time based on how empty the bottle is.
  //
  // e.g. (2000 + (5000 * ((100-50) / 100))) - 2000
  //
  //     2000 = full bottle shot pour (ms)
  //     5000 = empty-ish (near empty) bottle shot (ms)
  //     100 = full_bottle_fill (parameter)
  //     50 = current_bottle_fill (parameter)
  //
  const actual_duration = (
    measurement.full_bottle_pour_duration +
    (
      (
        measurement.near_empty_bottle_pour_duration -
        measurement.full_bottle_pour_duration
      )
      *
      (
        (full_bottle_fill - current_bottle_fill) / full_bottle_fill
      )
    )
  );

  console.log(`${full_bottle_duration} + (1 / ${fill_ratio}) * ${skew} - ${skew} = ${actual_duration}`)

  return Math.round(actual_duration);
}

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

    console.log('------ drink -------');
    console.log(drink);

    const pours = await getPoursForDrink(sqlite3_db, id);
    if (pours.length <= 0) {
      res.status(404).json({
        error: 'pours for drink (id=${drink.id}) not found'
      });
      return;
    }

    const robotPours = [];

    for (let i = 0; i < pours.length; i++) {
      const pour = pours[i];

      const bottle = await bottles.db.getById(sqlite3_db,
                                              pour.bottle_id);

      robotPours.push({ pour, bottle });

      const new_bottle_liters = bottle.current_liters - pour.liters;

      await bottles.db.setBottleLevel(sqlite3_db,
                                      pour.bottle_id,
                                      new_bottle_liters);
    }

    await Promise.all([
      // of course, all drinks get a straw
      robots.dispense_straw().then(() => {
        console.log('finished dispensing straw');
      }),

    ].concat(robotPours.map(roboPour => { // construct all pours

      const { bottle, pour } = roboPour;

      if (bottle.pump_type === 'air') {
        let pour_duration_ms = get_air_bottle_pour_duration(
          pour.liters, bottle.current_liters, bottle.max_liters);

        console.log(`(air) pouring '${bottle.name}' with duration ${pour_duration_ms}`);

        // fire the pin. it siphens back into the containers.
        return robots.on_then_off(bottle.rpi_pin_1, pour_duration_ms);

      } else if (bottle.pump_type === 'peristaltic') {

        let pour_duration_ms = get_peristaltic_bottle_pour_duration(pour.liters);

        console.log(`(per) pouring '${bottle.name}' with duration ${pour_duration_ms}`);

        console.log('[[bottle]]', bottle);

        // fire the pump in the forward direction
        return robots.on_then_off(bottle.rpi_pin_1, pour_duration_ms).then(() => {
          // suck it all back with a 100ms buffer
          robots.on_then_off(bottle.rpi_pin_2, (pour_duration_ms + 100));
        });
      }

    })));

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
