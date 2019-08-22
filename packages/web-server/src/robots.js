const rpio = require('rpio');

exports.on_then_off = (pin, ms) => new Promise((resolve, reject) => {
  rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  rpio.write(pin, rpio.LOW);

  setTimeout(() => {
    rpio.write(pin, rpio.HIGH);
    resolve();
  }, ms);
});

exports.dispenseStraw = (pinForStrawDispenser) => {
  return Promise.resolve(); // @TODO
  // return exports.on_then_off(pinForStrawDispenser, 10000);
}
