// TODO: this organization is hot garbo.
//
// when adding new entries, please insert them in the proper order
// with a short description of what the pins are operating.
//

pins = {
  bottle_rum: 11, // air pump
  bottle_gin: 29, // air pump
  bottle_vodka: 12, // air pump
  bottle_scotch: 13, // air pump
  bottle_irish_whisky: 15, // air pump
  bottle_tequila: 16, // air pump
  bottle_burbon: 18, // air pump

  bottle_coke: 19, // peristaltic pump
  bottle_code_reverse: 21, // peristaltic pump (in reverse)

  bottle_ginger_ale: 22, // peristaltic pump
  bottle_ginger_ale_reverse: 23, // peristaltic pump (in reverse)

  bottle_tonic: 24, // peristaltic pump
  bottle_tonic_reverse: 26,  // peristaltic pump (in reverse)

  bottle_lemon_lime: 7, // air pump

  bottle_cranberry: 31, // air pump

  straw_dispenser: 32,  // relay to a motor

  mouth_flashing: 33, // LED's "on and off"
};

// enforces that this object has been set up correctly
// and crashes out if not.
const unique_values = [];
Object.values(pins).forEach(value => {
  if (unique_values.indexOf(value) !== -1) {
    console.error("Please adjust your pinout values, there is a duplicate");
    console.error("This is a fatal error, fix it in `pins.js`.");
    process.exit(1);
  }

  unique_values.push(value);
});

module.exports = pins;
