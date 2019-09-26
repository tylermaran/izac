const request = require('request');

const DEVICE_TYPES = exports.DEVICE_TYPES = {
  AIR_PUMP: "air_pump",
  PERISTALTIC_PUMP: "peristaltic_pump",
  STRAW_DISPENSER: "straw_dispenser",
  RASPBERRY_PI_4B: "raspberry_pi_4b"
};

const DEVICE_ACTIONS = exports.DEVICE_ACTIONS = {
  BLOW: "blow",
  PUMP_FORWARD: "pump_forward",
  PUMP_REVERSE: "pump_reverse",
  DISPENSE: "dispense"
};

exports.firePin = (pinServerPort, pin, ms, output) => new Promise((resolve, reject) => {
  request({
    method: "POST",
    uri: `http://localhost:${pinServerPort}/pins/${pin}/fire`,
    json: {
      output,
      sleep_ms: ms
    }
  }, (error, response, body) => {
    return response.statusCode !== 204 ? reject() : resolve();
  });
});

exports.low_then_high = (pinServerPort, pin, ms) =>
  exports.firePin(pinServerPort, pin, ms, 0);

exports.high_then_low = (pinServerPort, pin, ms) =>
  exports.firePin(pinServerPort, pin, ms, 1);

exports.dispenseStraw = (pinForStrawDispenser) => {
  return Promise.resolve(); // @TODO
}
