exports.get = (req, res) => {
  res.status(204);
  res.end();
};

exports.create = (req, res) => {
  res.status(204);
  res.end();
};

exports.refill = (req, res) => {
  res.status(204);
  res.end();
};


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
