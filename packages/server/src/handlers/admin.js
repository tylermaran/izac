const rpio = require('rpio');

exports.pins = {};

exports.pins.fire = (req, res) => {
  const { pin } = req.params;

  let pinNumber;
  try {
    pinNumber = parseInt(pin, 10);
  } catch (error) {
    res.status(400).json({ error: "unable to parse provided pin" });
  }

  rpio.open(pinNumber, rpio.OUTPUT, rpio.LOW);
  rpio.write(pinNumber, rpio.LOW);

  setTimeout(() => {
    rpio.write(pinNumber, rpio.HIGH);
    res.status(204).end();
  }, 1000);
};

exports.database = {};

exports.database.init = (sqlite3_db) => async (req, res) => {
  await this.db.bottle.create(sqlite3_db);
  await this.db.drink.create(sqlite3_db);

  // >>>> bottles (liquor)
  await db.bottle.add(
    sqlite3_db, "rum", 1.75, 'air', pins.bottle_rum); // id=1
  await db.bottle.add(
    sqlite3_db, "gin", 1.75, 'air', pins.bottle_gin); // id=2
  await db.bottl.add(
    sqlitee3_db, "vodka", 1.75, 'air', pins.bottle_vodka); // id=3
  await db.bottle.add(
    sqlite3_db, "scotch", 1.75, 'air', pins.bottle_scotch); // id=4
  await db.bottle.add(
    sqlite3_db, "irish whisky", 1.75, 'air', pins.bottle_irish_whisky); // id=5
  await db.bottle.add(
    sqlite3_db, "tequila", 1.75, 'air', pins.bottle_tequila); // id=6
  await db.bottle.add(
    sqlite3_db, "burbon", 1.75, 'air', pins.bottle_burbon); // id=7

  // >>>> bottles (mixers)
  await db.bottle.add(
    sqlite3_db, "coke", 2, 'peristaltic',
    pins.bottle_coke, pins.bottle_coke_reverse); // id=8
  await db.bottle.add(
    sqlite3_db, "ginger ale", 2, 'peristaltic',
    pins.bottle_ginger_ale, pins.bottle_ginger_ale_reverse); // id=9
  await db.bottle.add(
    sqlite3_db, "tonic", 2, 'peristaltic',
    pins.bottle_tonic, pins.bottle_tonic_reverse); // id=10

  await db.bottle.add(
    sqlite3_db, "lemon lime", 2, 'air', pins.bottle_lemon_lime); // id=11
  await db.bottle.add(
    sqlite3_db, "cranberry", 3.78541, 'air', pins.bottle_cranberry); // id=12


  const four_oz_in_liters = 0.118294;
  const shot_in_liters = 0.044;
  const one_shot_chaser = four_oz_in_liters - shot_in_liters;

  // >>>> drinks (RUM id=1)
  await db.drink.add(sqlite3_db, "Rum (neat)", [
    { bottle_id: "1",  liters: shot_in_liters }
  ]);

  await db.drink.add(sqlite3_db, "Rum Lemon-Lime", [
    { bottle_id: "1",  liters: shot_in_liters },
    { bottle_id: "12", liters: one_shot_chaser } //  - 0.044 =
  ]);

  await db.drink.add(sqlite3_db, "Rum & Coke", [
    { bottle_id: "1",  liters: shot_in_liters },
    { bottle_id: "12", liters: one_shot_chaser }
  ]);

  // >>>> drinks (Gin id=2)
  await db.drink.add(sqlite3_db, "Gin (neat)", [
    { bottle_id: "2",  liters: shot_in_liters }
  ]);

  await db.drink.add(sqlite3_db, "Gin & Ginger Ale", [
    { bottle_id: "2",  liters: shot_in_liters },
    { bottle_id: "9",  liters: one_shot_chaser }
  ]);

  // >>>> drinks (VODKA id=3)
  await db.drink.add(sqlite3_db, "Vodka (neat)", [
    { bottle_id: "3",  liters: shot_in_liters }
  ]);

  await db.drink.add(sqlite3_db, "Vodka Tonic", [
    { bottle_id: "3", liters: shot_in_liters },
    { bottle_id: "10", liters: one_shot_chaser }
  ]);

  await db.drink.add(sqlite3_db, "Vodka Cranberry", [
    { bottle_id: "3", liters: shot_in_liters },
    { bottle_id: "11", liters: one_shot_chaser }
  ]);

  // >>> drinks (SCOTCH id=4)
  await db.drink.add(sqlite3_db, "Scotch (neat)", [
    { bottle_id: "4",  liters: shot_in_liters }
  ]);

  // >>> drinks (Irish_Whisky id=5)
  await db.drink.add(sqlite3_db, "Irish Whisky (neat)", [
    { bottle_id: "5",  liters: shot_in_liters }
  ]);

  // >>> drinks ("tequila" id=6)
  await db.drink.add(sqlite3_db, "Tequila (neat)", [
    { bottle_id: "6",  liters: shot_in_liters }
  ]);

  // >>> drinks ("burbon" id=7)
  await db.drink.add(sqlite3_db, "Burbon (neat)", [
    { bottle_id: "7",  liters: shot_in_liters }
  ]);

};
