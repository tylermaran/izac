// const rpio = require('rpio');
const { pin } = require('../robots');

const FOUR_OZ_IN_LITERS = 0.118294;
const SHOT_IN_LITERS = 0.044;
const ONE_SHOT_CHASER = FOUR_OZ_IN_LITERS - SHOT_IN_LITERS;

exports.pins = {};

exports.pins.fire = (req, res) => {
  // const { pin } = req.params;

  // let pinNumber;
  // try {
  //   pinNumber = parseInt(pin, 10);
  // } catch (error) {
  //   res.status(400).json({ error: "unable to parse provided pin" });
  // }

  // rpio.open(pinNumber, rpio.OUTPUT, rpio.LOW);
  // rpio.write(pinNumber, rpio.LOW);

  // setTimeout(() => {
  //   rpio.write(pinNumber, rpio.HIGH);
  //   res.status(204).end();
  // }, 1000);
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
  const { lastID: piDeviceID } = await db.device.add(piTypeID, "mind_of_iZac");

  const { lastID: cokeDeviceID  } = await db.device.add(periPumpTypeID, "coke");
  const { lastID: tonicDeviceID  } = await db.device.add(periPumpTypeID, "tonic");
  const { lastID: gingerAleDeviceID  } = await db.device.add(periPumpTypeID, "ginger_ale");

  const { lastID: rumDeviceID } = await db.device.add(airPumpTypeID, 'rum');
  const { lastID: ginDeviceID } = await db.device.add(airPumpTypeID, 'gin');
  const { lastID: tequilaDeviceID } = await db.device.add(airPumpTypeID, 'tequila');
  const { lastID: whiskyDeviceID } = await db.device.add(airPumpTypeID, 'whisky');
  const { lastID: scotchDeviceID } = await db.device.add(airPumpTypeID, 'scotch');
  const { lastID: lemonLimeDeviceID } = await db.device.add(airPumpTypeID, 'lemon-lime');

  //
  // >>> pinouts
  //
  await db.pin.add(piDeviceID, 8, gingerAleDeviceID, actionPumpReverseID);
  await db.pin.add(piDeviceID, 10, gingerAleDeviceID, actionPumpForwardID);

  await db.pin.add(piDeviceID, 13, cokeDeviceID, actionPumpReverseID);
  await db.pin.add(piDeviceID, 18, cokeDeviceID, actionPumpForwardID);

  await db.pin.add(piDeviceID, 19, tonicDeviceID, actionPumpReverseID);
  await db.pin.add(piDeviceID, 21, tonicDeviceID, actionPumpForwardID);

  await db.pin.add(piDeviceID, 23, rumDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 24, ginDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 26, tequilaDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 29, whiskyDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 31, scotchDeviceID, actionPumpForwardID);
  await db.pin.add(piDeviceID, 32, lemonLimeDeviceID, actionPumpForwardID);

  //
  // >>>> bottles
  //
  const { lastID: rumBottleID } = await db.bottle.add(
    "rum", 1.75, rumDeviceID);
  const { lastID: ginBottleID } = await db.bottle.add(
    "gin", 1.75, ginDeviceID);
  const { lastID: scotchBottleID } = await db.bottle.add(
    "scotch", 1.75, scotchDeviceID);
  const { lastID: whiskyBottleID } = await db.bottle.add(
    "irish whisky", 1.75, whiskyDeviceID);
  const { lastID: tequilaBottleID } = await db.bottle.add(
    "tequila", 1.75, tequilaDeviceID);
  const { lastID: lemonLimeBottleID } = await db.bottle.add(
    "lemon lime", 2, lemonLimeDeviceID);
  const { lastID: cokeBottleID } = await db.bottle.add(
    "coke", 2, cokeDeviceID);
  const { lastID: gingerAleBottleID } = await db.bottle.add(
    "ginger ale", 2, gingerAleDeviceID);
  const { lastID: tonicBottleID } = await db.bottle.add(
    "tonic", 2, tonicDeviceID);

  //
  // >>>> drinks
  //
  await db.drink.add("Rum (neat)", [
    { bottle_id: rumBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Rum Lemon-Lime", [
    { bottle_id: rumBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: lemonLimeBottleID, liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Rum & Coke", [
    { bottle_id: rumBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: cokeBottleID, liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Gin (neat)", [
    { bottle_id: ginBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Gin & Ginger Ale", [
    { bottle_id: ginBottleID,  liters: SHOT_IN_LITERS },
    { bottle_id: gingerAleBottleID,  liters: ONE_SHOT_CHASER }
  ]);

  await db.drink.add("Scotch (neat)", [
    { bottle_id: scotchBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Irish Whisky (neat)", [
    { bottle_id: whiskyBottleID,  liters: SHOT_IN_LITERS }
  ]);

  await db.drink.add("Tequila (neat)", [
    { bottle_id: tequilaBottleID,  liters: SHOT_IN_LITERS }
  ]);

  res.status(204).end();
};
