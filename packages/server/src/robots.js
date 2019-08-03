const rpio = require('rpio');

exports.on_then_off = (pin, ms) => new Promise((resolve, reject) => {
  rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  rpio.write(pin, rpio.LOW);

  setTimeout(() => {
    rpio.write(pin, rpio.HIGH);
    resolve();
  }, ms);
});
