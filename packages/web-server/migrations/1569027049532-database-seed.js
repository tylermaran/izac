const path = require('path');
const Database = require('../src/db');
const config = require('../config');

const db = new Database(config.sqlite3.filename);

const {
  DeviceType, DeviceAction, Device, Pin,
  Bottle, Pour, Drink, DrinkPour
} = db.models;

module.exports.up = function (next) {
  (async function() {
    try {
      // calling `sync` with force replaces the tables in the
      // database. danger!
      await db.__sync({ force: true });

      // ---------------------------------------------------------------
      // >>>> device types
      //
      const type_pi = await DeviceType.create({ name: 'raspberry_pi_4b' });
      const type_periPump = await DeviceType.create({ name: 'peristaltic_pump' });
      const type_airPump = await DeviceType.create({ name: 'air_pump' });
      const type_strawDispenser = await DeviceType.create({ name: 'straw_dispenser' });

      // ---------------------------------------------------------------
      // >>>> device actions
      //
      const action_blow = await DeviceAction.create({ name: 'blow' });
      const action_pumpForward = await DeviceAction.create({ name: 'pump_forward' });
      const action_pumpReverse = await DeviceAction.create({ name: 'pump_reverse' });
      const action_dispense = await DeviceAction.create({ name: 'dispense' });

      // ---------------------------------------------------------------
      // >>> devices
      //

      // raspberry pi(s)
      const device_pi = await Device.create({
        name: "mind_of_iZac",
        deviceTypeId: type_pi.get('id')
      });

      // straw dispenser (1 total)
      const device_strawDispenser = await Device.create({
        name: "staw_dispenser",
        deviceTypeId: type_strawDispenser.get('id')
      });

      // peristaltic pumps (4 total)
      const device_coke = await Device.create({
        name: "coke",
        deviceTypeId: type_periPump.get('id')
      });
      const device_tonic = await Device.create({
        name: "tonic",
        deviceTypeId: type_periPump.get('id')
      });
      const device_gingerAle = await Device.create({
        name: "ginger-ale",
        deviceTypeId: type_periPump.get('id')
      });
      const device_e_Undefined = await Device.create({
        name: "e_unassigned",
        deviceTypeId: type_periPump.get('id')
      });

      // air pumps (14)
      const device_spicedRum = await Device.create({
        name: 'spiced-rum',
        deviceTypeId: type_airPump.get('id')
      });
      const device_tequila = await Device.create({
        name: 'tequila',
        deviceTypeId: type_airPump.get('id')
      });
      const device_gin = await Device.create({
        name: 'gin',
        deviceTypeId: type_airPump.get('id')
      });
      const device_bourbon = await Device.create({
        name: 'bourbon',
        deviceTypeId: type_airPump.get('id')
      });
      const device_vodka = await Device.create({
        name: 'vodka',
        deviceTypeId: type_airPump.get('id')
      });
      const device_lemonLime = await Device.create({
        name: 'lemon-lime',
        deviceTypeId: type_airPump.get('id')
      });
      const device_scotch = await Device.create({
        name: 'scotch',
        deviceTypeId: type_airPump.get('id')
      });
      const device_irishWhisky = await Device.create({
        name: 'irish-whisky',
        deviceTypeId: type_airPump.get('id')
      });
      const device_cranberry = await Device.create({
        name: 'cranberry',
        deviceTypeId: type_airPump.get('id')
      });
      const device_coffeeLiquor = await Device.create({
        name: 'coffee-liquor',
        deviceTypeId: type_airPump.get('id')
      });
      const device_a_Undefined = await Device.create({
        name: 'a_unassigned',
        deviceTypeId: type_airPump.get('id')
      });
      const device_b_Undefined = await Device.create({
        name: 'b_unassigned',
        deviceTypeId: type_airPump.get('id')
      });
      const device_c_Undefined = await Device.create({
        name: 'c_unassigned',
        deviceTypeId: type_airPump.get('id')
      });
      const device_d_Undefined = await Device.create({
        name: 'd_unassigned',
        deviceTypeId: type_airPump.get('id')
      });

      // ---------------------------------------------------------------
      // >>> pinouts (raspberry pi)
      //

      // [pin=40]

      const pi_pin_40 = await Pin.create({
        physical_pin_number: 40,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_spicedRum.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=39; not set]

      // [pin=38]
      const pi_pin_38 = await Pin.create({
        physical_pin_number: 38,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_gin.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=37]
      const pi_pin_37 = await Pin.create({
        physical_pin_number: 37,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_bourbon.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=36]
      const pi_pin_36 = await Pin.create({
        physical_pin_number: 36,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_vodka.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=35]
      const pi_pin_35 = await Pin.create({
        physical_pin_number: 35,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_lemonLime.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=34; not set]

      // [pin=33]
      const pi_pin_33 = await Pin.create({
        physical_pin_number: 33,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_scotch.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=32]
      const pi_pin_32 = await Pin.create({
        physical_pin_number: 32,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_irishWhisky.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=31]
      const pi_pin_31 = await Pin.create({
        physical_pin_number: 31,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_cranberry.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=30; not set]

      // [pin=29]
      const pi_pin_29 = await Pin.create({
        physical_pin_number: 29,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_coffeeLiquor.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=28; not set]

      // [pin=27; not set]

      // [pin=26]
      const pi_pin_26 = await Pin.create({
        physical_pin_number: 26,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_a_Undefined.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=25; not set]

      // [pin=24]
      const pi_pin_24 = await Pin.create({
        physical_pin_number: 24,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_b_Undefined.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=23]
      const pi_pin_23 = await Pin.create({
        physical_pin_number: 23,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_c_Undefined.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=22]
      const pi_pin_22 = await Pin.create({
        physical_pin_number: 22,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_d_Undefined.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=21]
      const pi_pin_21 = await Pin.create({
        physical_pin_number: 21,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_tequila.get('id'),
        deviceActionId: action_blow.get('id')
      });

      // [pin=20; not set]

      // [pin=19]
      const pi_pin_19 = await Pin.create({
        physical_pin_number: 19,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_coke.get('id'),
        deviceActionId: action_pumpForward.get('id')
      });

      // [pin=18]
      const pi_pin_18 = await Pin.create({
        physical_pin_number: 18,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_coke.get('id'),
        deviceActionId: action_pumpReverse.get('id')
      });

      // [pin=17; not set]

      // [pin=16]
      const pi_pin_16 = await Pin.create({
        physical_pin_number: 16,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_gingerAle.get('id'),
        deviceActionId: action_pumpForward.get('id')
      });

      // [pin=15]
      const pi_pin_15 = await Pin.create({
        physical_pin_number: 15,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_gingerAle.get('id'),
        deviceActionId: action_pumpReverse.get('id')
      });

      // [pin=14; not set]

      // [pin=13]
      const pi_pin_13 = await Pin.create({
        physical_pin_number: 13,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_tonic.get('id'),
        deviceActionId: action_pumpForward.get('id')
      });

      // [pin=12]
      const pi_pin_12 = await Pin.create({
        physical_pin_number: 12,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_tonic.get('id'),
        deviceActionId: action_pumpReverse.get('id')
      });

      // [pin=11]
      const pi_pin_11 = await Pin.create({
        physical_pin_number: 11,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_e_Undefined.get('id'),
        deviceActionId: action_pumpForward.get('id')
      });

      // [pin=10]
      const pi_pin_10 = await Pin.create({
        physical_pin_number: 10,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_e_Undefined.get('id'),
        deviceActionId: action_pumpReverse.get('id')
      });

      // [pin=9; not set]

      // [pin=8]
      const pi_pin_8 = await Pin.create({
        physical_pin_number: 8,
        deviceId: device_pi.get('id'),
        attachedDeviceId: device_strawDispenser.get('id'),
        deviceActionId: action_dispense.get('id')
      });

      // [pin=7; not set]
      // [pin=6; not set]
      // [pin=5; not set]
      // [pin=4; not set]
      // [pin=3; not set]
      // [pin=2; not set]
      // [pin=1; not set]

      // ---------------------------------------------------------------
      // >>>> bottles
      //
      const bottle_spicedRum = await Bottle.create({
        name: "spiced rum",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_spicedRum.get('id')
      });

      const bottle_tequila = await Bottle.create({
        name: "tequila",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_tequila.get('id')
      });

      const bottle_gin = await Bottle.create({
        name: "gin",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_gin.get('id')
      });

      const bottle_bourbon = await Bottle.create({
        name: "bourbon",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_bourbon.get('id')
      });

      const bottle_vodka = await Bottle.create({
        name: "vodka",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_vodka.get('id')
      });

      const bottle_lemonLime = await Bottle.create({
        name: "lemon lime",
        max_liters: 2,
        current_liters: 2,
        deviceId: device_lemonLime.get('id')
      });

      const bottle_scotch = await Bottle.create({
        name: "scotch",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_scotch.get('id')
      });

      const bottle_irishWhisky = await Bottle.create({
        name: "irish whisky",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_irishWhisky.get('id')
      });

      const bottle_cranberry = await Bottle.create({
        name: "cranberry",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_cranberry.get('id')
      });

      const bottle_coffeeLiquor = await Bottle.create({
        name: "coffee liquor",
        max_liters: 1.75,
        current_liters: 1.75,
        deviceId: device_coffeeLiquor.get('id')
      });

      const bottle_coke = await Bottle.create({
        name: "coke",
        max_liters: 2,
        current_liters: 2,
        deviceId: device_coke.get('id')
      });

      const bottle_gingerAle = await Bottle.create({
        name: "ginger ale",
        max_liters: 2,
        current_liters: 2,
        deviceId: device_gingerAle.get('id')
      });

      const bottle_tonic = await Bottle.create({
        name: "tonic",
        max_liters: 2,
        current_liters: 2,
        deviceId: device_tonic.get('id')
      });

      // ---------------------------------------------------------------
      // >>>> pours
      //
      const FOUR_OZ_L = 0.118294;
      const ONE_SHOT_L = 0.044;
      const ONE_SHOT_CHASER_L = FOUR_OZ_L - ONE_SHOT_L;

      const pour_shot_spicedRum = await Pour.create({
        liters: ONE_SHOT_L,
        bottleId: bottle_spicedRum.get('id')
      });

      const pour_shot_gin = await Pour.create({
        liters: ONE_SHOT_L,
        bottleId: bottle_gin.get('id')
      });

      const pour_shot_scotch = await Pour.create({
        liters: ONE_SHOT_L,
        bottleId: bottle_scotch.get('id')
      });

      const pour_shot_irishWhisky = await Pour.create({
        liters: ONE_SHOT_L,
        bottleId: bottle_irishWhisky.get('id')
      });

      const pour_shot_tequila = await Pour.create({
        liters: ONE_SHOT_L,
        bottleId: bottle_tequila.get('id')
      });

      const pour_shot_vodka = await Pour.create({
        liters: ONE_SHOT_L,
        bottleId: bottle_vodka.get('id')
      });

      const pour_shot_bourbon = await Pour.create({
        liters: ONE_SHOT_L,
        bottleId: bottle_bourbon.get('id')
      });

      const pour_shot_chaser_gingerAle = await Pour.create({
        liters: ONE_SHOT_CHASER_L,
        bottleId: bottle_gingerAle.get('id')
      });

      const pour_shot_chaser_coke = await Pour.create({
        liters: ONE_SHOT_CHASER_L,
        bottleId: bottle_coke.get('id')
      });

      const pour_shot_chaser_tonic = await Pour.create({
        liters: ONE_SHOT_CHASER_L,
        bottleId: bottle_tonic.get('id')
      });

      const pour_shot_chaser_lemonLime = await Pour.create({
        liters: ONE_SHOT_CHASER_L,
        bottleId: bottle_lemonLime.get('id')
      });

      const pour_shot_chaser_cranberry = await Pour.create({
        liters: ONE_SHOT_CHASER_L,
        bottleId: bottle_cranberry.get('id')
      });

      // ---------------------------------------------------------------
      // >>>> drinks
      //
      const drink_neat_rum = await Drink.create({ name: 'Rum (neat)' });

      await drink_neat_rum.setPours([ pour_shot_spicedRum ]);


      const drink_neat_gin = await Drink.create({name: "Gin (neat)"});
      await drink_neat_gin.setPours([ pour_shot_gin ]);

      const drink_neat_scotch = await Drink.create({name: "Scotch (neat)"});
      await drink_neat_scotch.setPours([ pour_shot_scotch ]);

      const drink_neat_irishWhisky = await Drink.create({name: "Irish Whisky (neat)"});
      await drink_neat_irishWhisky.setPours([ pour_shot_irishWhisky ]);

      const drink_neat_tequila = await Drink.create({name: "Tequila (neat)"})
      await drink_neat_tequila.setPours([ pour_shot_tequila ]);

      const drink_neat_vodka = await Drink.create({name: "Vodka (neat)"});
      await drink_neat_vodka.setPours([ pour_shot_vodka ]);

      const drink_gin_ginger = await Drink.create({ name: "Gin & Ginger" });
      await drink_gin_ginger.setPours([ pour_shot_gin, pour_shot_chaser_gingerAle ]);

      const drink_tequila_ginger = await Drink.create({ name: "Tequila Ginger" });
      await drink_tequila_ginger.setPours([ pour_shot_tequila, pour_shot_chaser_gingerAle ]);

      const drink_vodka_ginger = await Drink.create({ name: "Vodka Ginger" });
      await drink_vodka_ginger.setPours([ pour_shot_vodka, pour_shot_chaser_gingerAle ]);

      const drink_bourbon_ginger = await Drink.create({ name: "Bourbon Ginger" });
      await drink_bourbon_ginger.setPours([ pour_shot_bourbon, pour_shot_chaser_gingerAle ]);

      const drink_scotch_ginger = await Drink.create({ name: "Scotch Ginger" });
      await drink_bourbon_ginger.setPours([ pour_shot_scotch, pour_shot_chaser_gingerAle ]);

      const drink_vodka_cranberry = await Drink.create({ name: "Vodka Cranberry" });
      await drink_vodka_cranberry.setPours([ pour_shot_vodka, pour_shot_chaser_cranberry ]);

      const drink_vodka_lemonLime = await Drink.create({ name: "Vodka Lemon-Lime" });
      await drink_vodka_lemonLime.setPours([ pour_shot_vodka, pour_shot_chaser_lemonLime ]);

      const drink_rum_lemonLime = await Drink.create({ name: "Spiced Rum Lemon-Lime" });
      await drink_rum_lemonLime.setPours([ pour_shot_spicedRum, pour_shot_chaser_lemonLime ]);

      const drink_margarita = await Drink.create({ name: "Margarita" });
      await drink_margarita.setPours([ pour_shot_tequila, pour_shot_chaser_lemonLime ]);

      const drink_rum_coke = await Drink.create({ name: "Spiced Rum & Coke" });
      await drink_rum_coke.setPours([ pour_shot_spicedRum, pour_shot_chaser_coke ]);

      const drink_bourbon_coke = await Drink.create({ name: "Bourbon & Coke" });
      await drink_bourbon_coke.setPours([ pour_shot_bourbon, pour_shot_chaser_coke ]);

      const drink_whisky_coke = await Drink.create({ name: "Irish Whisky & Coke" });
      await drink_whisky_coke.setPours([ pour_shot_irishWhisky, pour_shot_chaser_coke ]);

      const drink_vodka_tonic = await Drink.create({ name: "Vodka Tonic" });
      await drink_vodka_tonic.setPours([ pour_shot_vodka, pour_shot_chaser_tonic ]);

      const drink_gin_tonic = await Drink.create({ name: "Gin & Tonic" });
      await drink_gin_tonic.setPours([ pour_shot_gin, pour_shot_chaser_tonic ]);

      next();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}

module.exports.down = function (next) {
  (async function() {
    try {
      await DeviceType.drop();
      await DeviceAction.drop();
      await Device.drop();
      await Pin.drop();
      await Bottle.drop();
      await Pour.drop();
      await Drink.drop();
      await DrinkPour.drop();
      next();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
