const rpio = require('rpio');
const { pin } = require('../robots');

const FOUR_OZ_IN_LITERS = 0.118294;
const SHOT_IN_LITERS = 0.044;
const ONE_SHOT_CHASER = FOUR_OZ_IN_LITERS - SHOT_IN_LITERS;

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

exports.database.drop = (db) => async(req, res) => {
  await db.bottle.drop();
  await db.device.drop();
  await db.device_action.drop();
  await db.device_type.drop();
  await db.drink.drop();
  await db.drink_pour.drop();
  await db.pin.drop();

  return res.status(204).end();
};

exports.database.init = (db) => async (req, res) => {

  await db.bottle.create();
  await db.device.create();
  await db.device_action.create();
  await db.device_type.create();
  await db.drink.create();
  await db.drink_pour.create();
  await db.pin.create();

  //
  // >>>> device types
  //
  const { lastID: piTypeID } = await db.device_type.add('raspberry_pi_3_b+');
  const { lastID: periPumpTypeID } = await db.device_type.add('peristaltic_pump');
  const { lastID: airPumpTypeID } = await db.device_type.add('air_pump');
  const { lastID: strawDispenserTypeID } = await db.device_type.add('straw_dispenser');

  //
  // >>>> device actions
  //
  const { lastID: actionPumpForwardID } = await db.device_action.add('pump_forward');
  const { lastID: actionPumpReverseID } = await db.device_action.add('pump_reverse');
  const { lastID: actionDispenseID } = await db.device_action.add('dispense');

  //
  // >>> devices
  //

  // raspberry pi (1 total)
  const { lastID: piDeviceID } = await db.device.add(piTypeID, "mind_of_iZac");

  // peristaltic pumps (4 total)
  const { lastID: cokeDeviceID  } = await db.device.add(periPumpTypeID, "coke");
  const { lastID: tonicDeviceID  } = await db.device.add(periPumpTypeID, "tonic");
  const { lastID: gingerAleDeviceID  } = await db.device.add(periPumpTypeID, "ginger-ale");
  const { lastID: e_UndefinedDeviceID } = await db.device.add(periPumpTypeID, "e_unassigned");

  // air pumps (14)
  const { lastID: spicedRumDeviceID } = await db.device.add(airPumpTypeID, 'spiced-rum');
  const { lastID: tequilaDeviceID } = await db.device.add(airPumpTypeID, 'tequila');
  const { lastID: ginDeviceID } = await db.device.add(airPumpTypeID, 'gin');
  const { lastID: bourbonDeviceID } = await db.device.add(airPumpTypeID, 'bourbon');
  const { lastID: vodkaDeviceID } = await db.device.add(airPumpTypeID, 'vodka');
  const { lastID: lemonLimeDeviceID } = await db.device.add(airPumpTypeID, 'lemon-lime');
  const { lastID: scotchDeviceID } = await db.device.add(airPumpTypeID, 'scotch');
  const { lastID: irishWhiskyDeviceID } = await db.device.add(airPumpTypeID, 'irish-whisky');
  const { lastID: cranberryDeviceID } = await db.device.add(airPumpTypeID, 'cranberry');
  const { lastID: coffeeLiquorDeviceID } = await db.device.add(airPumpTypeID, 'coffee-liquor');
  const { lastID: a_UndefinedDeviceID } = await db.device.add(airPumpTypeID, 'a_unassigned');
  const { lastID: b_UndefinedDeviceID } = await db.device.add(airPumpTypeID, 'b_unassigned');
  const { lastID: c_UndefinedDeviceID } = await db.device.add(airPumpTypeID, 'c_unassigned');
  const { lastID: d_UndefinedDeviceID } = await db.device.add(airPumpTypeID, 'd_unassigned');

  //
  // >>> pinouts
  //
  await db.pin.add(piDeviceID, 40, spicedRumDeviceID, actionPumpForwardID);
  // 39
  await db.pin.add(piDeviceID, 38, ginDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 37, bourbonDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 36, vodkaDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 35, lemonLimeDeviceID, actionPumpForwardID);
  // 34
  await db.pin.add(piDeviceID, 33, lemonLimeDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 32, irishWhiskyDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 31, cranberryDeviceID, actionPumpForwardID);
  // 30
  await db.pin.add(piDeviceID, 29, coffeeLiquorDeviceID, actionPumpForwardID);
  // 28
  // 27
  await db.pin.add(piDeviceID, 26, a_UndefinedDeviceID, actionPumpForwardID);
  // 25
  await db.pin.add(piDeviceID, 24, b_UndefinedDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 23, c_UndefinedDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 22, d_UndefinedDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 21, tequilaDeviceID, actionPumpForwardID);
  // 20
  await db.pin.add(piDeviceID, 19, cokeDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 18, cokeDeviceID, actionPumpReverseID);
  // 17
  await db.pin.add(piDeviceID, 16, gingerAleDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 15, gingerAleDeviceID, actionPumpReverseID);
  // 14
  await db.pin.add(piDeviceID, 13, tonicDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 12, tonicDeviceID, actionPumpReverseID);
  await db.pin.add(piDeviceID, 11, e_UndefinedDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 10, e_UndefinedDeviceID, actionPumpReverseID);
  // 9
  // 8
  // 7
  // 6
  // 5
  // 4
  // 3
  // 2
  // 1

  //
  // >>>> bottles
  //
  const { lastID: spicedRumBottleID } = await db.bottle.add("spiced rum", 1.75, spicedRumDeviceID);
  const { lastID: tequilaBottleID } = await db.bottle.add("tequila", 1.75, tequilaDeviceID);
  const { lastID: ginBottleID } = await db.bottle.add("gin", 1.75, ginDeviceID);
  const { lastID: bourbonBottleID } = await db.bottle.add("bourbon", 1.75, bourbonDeviceID);
  const { lastID: vodkaBottleID } = await db.bottle.add("vodka", 1.75, vodkaDeviceID);
  const { lastID: lemonLimeBottleID } = await db.bottle.add("lemon lime", 2, lemonLimeDeviceID);
  const { lastID: scotchBottleID } = await db.bottle.add("scotch", 1.75, scotchDeviceID);
  const { lastID: irishWhiskyBottleID } = await db.bottle.add("irish whisky", 1.75, irishWhiskyDeviceID);
  const { lastID: cranberryBottleID } = await db.bottle.add("cranberry", 1.75, cranberryDeviceID);
  const { lastID: coffeeLiquorBottleID } = await db.bottle.add("coffee liquor", 1.75, coffeeLiquorDeviceID);

  const { lastID: cokeBottleID } = await db.bottle.add("coke", 2, cokeDeviceID);
  const { lastID: gingerAleBottleID } = await db.bottle.add("ginger ale", 2, gingerAleDeviceID);
  const { lastID: tonicBottleID } = await db.bottle.add("tonic", 2, tonicDeviceID);

  //
  // >>>> drinks
  //

  // Neat drinks
  await db.drink.add("Rum (neat)", [
    { bottle_id: spicedRumBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Gin (neat)", [
    { bottle_id: ginBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Scotch (neat)", [
    { bottle_id: scotchBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Irish Whisky (neat)", [
    { bottle_id: irishWhiskyBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Tequila (neat)", [
    { bottle_id: tequilaBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Vodka (neat)", [
    { bottle_id: vodkaBottleID,  liters: SHOT_IN_LITERS }
  ]);

  // Standard Mixed Drinks
  await db.drink.add("Gin & Ginger", [
    { bottle_id: ginBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: gingerAleBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Tequila Ginger", [
    { bottle_id: tequilaBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: gingerAleBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Vodka Cranberry", [
    { bottle_id: vodkaBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: cranberryBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Vodka Lemon-Lime", [
    { bottle_id: vodkaBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: lemonLimeBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Rum Lemon-Lime", [
    { bottle_id: spicedRumBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: lemonLimeBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Margarita", [
    { bottle_id: tequilaBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: lemonLimeBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Rum & Coke", [
    { bottle_id: spicedRumBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: cokeBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Bourbon & Coke", [
    { bottle_id: bourbonBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: cokeBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Whisky & Coke", [
    { bottle_id: irishWhiskyBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: cokeBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Vodka Tonic", [
    { bottle_id: vodkaBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: tonicBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Gin & Tonic", [
    { bottle_id: ginBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: tonicBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Vodka Ginger", [
    { bottle_id: vodkaBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: gingerAleBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Bourbon Ginger", [
    { bottle_id: bourbonBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: gingerAleBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Scotch Ginger", [
    { bottle_id: scotchBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: gingerAleBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  res.status(204).end();
};
