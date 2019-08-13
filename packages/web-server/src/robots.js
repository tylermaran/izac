const gpio = require('rpi-gpio')
const gpiop = gpio.promise;

exports.dispenseStraw = () => Promise.resolve(); // @TODO

exports.on_then_off = (pin, ms) => new Promise((resolve, reject) => {
  return gpiop.setup(pin, gpio.DIR_OUT)
    .then(() => {
      return gpiop.write(pin, false)
    }).then(() => {
      return new Promise(r => setTimeout(r, ms));
    }).then(() => {
      return gpiop.write(pin, true);
    });

});
