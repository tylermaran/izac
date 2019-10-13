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

/**
   https://en.wikipedia.org/wiki/Normalization_(statistics)

   @param min - minimum value
   @param max - maximum value
   @param scale - a float value (0-1)


   e.g.

   normalize(50, 200, 0) // 50
   normalize(50, 200, 1) // 200
   normalize(50, 200, 0.5) // 125

 */
function normalize(min, max, scale) {
  return ((max - min) * scale) + min;
}

function get_peristaltic_bottle_pour_duration(liter_pour) {
  // our mesurement of what a shot is. This is a ratio that represents how
  // long it takes to pour a shot with the peristaltic pumps.
  const measurement = {
    liters: 0.044,
    full_bottle_pour_duration: 6000
  };

  // adjust the duration from of measurement to the passed in liters we're pouring
  // this time is ONLY valid for full bottles
  const pour_duration =
    (measurement.full_bottle_pour_duration *  liter_pour) / measurement.liters;

  return Math.round(pour_duration);
}


function get_air_bottle_pour_duration(
  liter_pour,
  currentLiters,
  maxLiters,
  msSinceLastPour
) {
  // with a full bottle (1.75L) of liquor, it takes ~2 seconds to pour
  // a shot (0.044L) out of the machine with our air pumps. We use
  // this ratio to calculate the time it takes other volumes to pour
  // out adjusted for bottle air pressure.

  const measurement = {
    liters: 0.044,
    // how long does it take to pour (in milliseconds) a shot with a
    // FULL bottle of liquor with our air pumps?
    full_bottle_pour_duration: 1400,
    near_empty_bottle_pour_duration: 1800
  };

  const fill_ratio = currentLiters / maxLiters;

  // adjust the pour time based on how empty the bottle is.
  //
  // e.g. assuming our values are:
  //
  //    full_bottle_pour_duration = 2000
  //    near_empty_bottle_pour_duration = 5000
  //
  // we have the following result:
  //
  //  (2000 + (5000 * ((100-50) / 100))) - 2000
  //
  //     2000 = full bottle shot pour (ms)
  //     5000 = empty-ish (near empty) bottle shot (ms)
  //     100 = maxLiters (parameter)
  //     50 = currentLiters (parameter)
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
          (maxLiters - currentLiters) / maxLiters
        )
      )
  );

  // "stale pours" are those that, uh. well. the air pumps don't keep
  // pressure in the bottles. if we haven't poured a bottle for certain
  // thresholds add more time lol.
  const minutesSinceLastPour = msSinceLastPour / 1000 / 60;

  const pressurize_time_ms = normalize(0, 2000, (
    (minutesSinceLastPour >= 25) ? 1 : minutesSinceLastPour / 25));

  const totalPourDuration = Math.round(pressurize_time_ms + actual_duration)

  console.log(`ms since last pour: ${msSinceLastPour}ms`);
  console.log(`pressurize time ms: ${pressurize_time_ms}`);
  console.log(`actual pour puration: ${actual_duration}`);
  console.log(`total pour duration: ${totalPourDuration}`);

  return totalPourDuration;
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

    console.log(JSON.stringify(drink, null, 4));

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

    // current time in ms.
    // (in number of milliseconds elapsed from January 1, 1970)
    const nowUnixMs = Date.now();

    console.log(`now unix ms lol: ${nowUnixMs}`);

    // map over each bottle pour, and return a promise that represents
    // a single bottle pour for the overall drink.
    const bottlePours = drink.pours.map((pour) => {
      // action promises that must be resolved for a single bottle pour.
      const pendingActions = [];

      const bottle = pour.bottle;
      const { device_type, pins } = bottle.device;

      // get last time the bottle was poured in ms (in number from Jan 1, 1970)
      const lastPouredUnixMs = new Date(bottle.updated_at).getTime();

      console.log(`last poured unix ms: ${lastPouredUnixMs}`);

      const msSinceLastPour = nowUnixMs - lastPouredUnixMs;

      // the current bottle level in liters.
      const currentLiters = bottle.max_liters * bottle.fill;
      // new bottle fill level = (new bottle level after pour) / max_liters
      const newFill = (currentLiters - pour.liters) / bottle.max_liters;

      // set the new bottle level accordingly
      pendingActions.push(db.bottle.setFill(bottle.id, newFill));

      switch (device_type.name) {
        case DEVICE_TYPES.AIR_PUMP: {
          const pin = pins[0]; // air pumps only have one pin

          const durMs = get_air_bottle_pour_duration(
            pour.liters, currentLiters, bottle.max_liters, msSinceLastPour);

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
            reversePin.physical_pin_number, // todo these are reversed lol
            durMs
          ).then(() => {
            return new Promise((resolve) => setTimeout(resolve, 500));
          }).then(() => {
            return robots.low_then_high(pinServerPort,
                                        forwardPin.physical_pin_number, // todo these are reversed lol
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
