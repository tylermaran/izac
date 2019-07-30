const rpio = require('rpio');

exports.pins = {};

exports.pins.fire = (req, res) => {
  const { pin } = req.params;

  let pinNumber;
  try {
    pinNumber = parseInt(pin, 10);
  } catch (error) {
    res.status(400).json({ error: "unable to parse provided pin" });
  }

  rpio.open(pinNumber, rpio.OUTPUT, rpio.LOW);
  rpio.write(pinNumber, rpio.LOW);

  setTimeout(() => {
    rpio.write(pinNumber, rpio.HIGH);
    res.status(204).end();
  }, 1000);
}
