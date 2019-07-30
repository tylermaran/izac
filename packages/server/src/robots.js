const rpio = require('rpio');
const pins = require('./pins');

exports.on_then_off = (pin, ms) => new Promise((resolve, reject) => {
    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  rpio.write(pin, rpio.LOW);

  console.log('---=-=-=----');
  console.log('firing pin', pin);

    setTimeout(() => {

      rpio.write(pin, rpio.HIGH);
      resolve();
    }, ms);
  });

exports.dispense_straw = () => exports.on_then_off(pins.straw_dispenser, 100);
