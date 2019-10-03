// const rpio = require('rpio');
const bottles = require('./bottles');
const robots = require('../robots');
const { DEVICE_TYPES, DEVICE_ACTIONS } = require('../robots');

exports.get = (db) => async (req, res) => {
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
    const drink = await db.drink.getByIdWithEverything(id);

    if (!drink) {
      res.status(404).json({ error: 'drink not found' });
      return;
    }

    res.status(200).json(drink);
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.getAll = (db) => async (req, res) => {
  try {
    const drinks = await db.drink.getAllWithPours();

    if (!drinks) {
      res.status(404).json({ error: 'no drinks not found' });
      return;
    }

    res.status(200).json({ drinks });
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

exports.pour = (db, pinServerPort) => async (req, res) => {

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
    const drink = await db.drink.getByIdWithEverything(id);

    if (!drink) {
      res.status(404).json({ error: 'drink not found' });
      return;
    }

    // reject any pours where the bottle fill is <= 5%
    for (pour of drink.pours) {
      if (pour.bottle.fill <= 0.05) {
        res.status(400).json({
          errors: [
            'not enough liquid for this drink',
            `bottle: ${pour.bottle.name}`
          ]
        });
        return;
      }
    }

    // map over each bottle pour, and return a promise that represents
    // a single bottle pour for the overall drink.
    const bottlePours = drink.pours.map((pour) => {
      // action promises that must be resolved for a single bottle pour.
      const pendingActions = [];

      const bottle = pour.bottle;
      const { device_type, pins } = bottle.device;

      // the current bottle level in liters.
      const currentLiters = bottle.max_liters * bottle.fill;
      // new bottle fill level = (new bottle level after pour) / max_liters
      const newFill = (currentLiters - pour.liters) / bottle.max_liters;

      // set the new bottle level accordingly
      pendingActions.push(db.bottle.setBottleFill(bottle.id, newFill));

      switch (device_type.name) {
        case DEVICE_TYPES.AIR_PUMP: {
          const pin = pins[0]; // air pumps only have one pin
          const durMs = get_air_bottle_pour_duration(
            pour.liters, currentLiters, bottle.max_liters);

          console.log(`air, pin=${pin}, dur=${durMs}, bottle=${bottle.name}`);
          pendingActions.push(robots.low_then_high(pinServerPort,
                                                   pin.physical_pin_number,
                                                   durMs));

          break;
        }
        case DEVICE_TYPES.PERISTALTIC_PUMP: {
          const durMs = get_peristaltic_bottle_pour_duration(pour.liters);
          const forwardPin = pins.find(p =>
            p.device_action.name === DEVICE_ACTIONS.PUMP_FORWARD);
          const reversePin = pins.find(p =>
            p.device_action.name === DEVICE_ACTIONS.PUMP_REVERSE);

          pendingActions.push(robots.low_then_high(
            pinServerPort,
            forwardPin.physical_pin_number,
            durMs
          ).then(() => {
            return new Promise((resolve) => setTimeout(resolve, 500));
          }).then(() => {
            return robots.low_then_high(pinServerPort,
                                        reversePin.physical_pin_number,
                                        durMs);
          }));

          break;
        }
      }

      return Promise.all(pendingActions).then(() => {
        console.log(`finished pouring ${bottle.name}`);
      });
    });

    await Promise.all(bottlePours);

    res.status(200).json(await db.drink.getByIdWithEverything(id));

  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};
