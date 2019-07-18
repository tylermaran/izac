const rpio = require('rpio');

//
// This is a demo handler that powers an LED for one second.
//
// @TODO: this handler waits to reply until the timeout ends. while
//        useful for the frontend (?), we might be overloading this
//        handler and it might lead to problems? might be ok if this
//        is all local but. something is fishy about this setup &
//        needs further discussion.
//
exports.blinkOnce = (req, res) => {
  // The "12" below refers to the physical pin order on the RPI.
  //
  // See: https://pinout.xyz/pinout/pin12_gpio18
  //
  rpio.open(12, rpio.OUTPUT, rpio.LOW);
  rpio.write(12, rpio.HIGH);
  setTimeout(() => {
    rpio.write(12, rpio.LOW);
    res.status(204);
    res.end();
  }, 1000);
};
