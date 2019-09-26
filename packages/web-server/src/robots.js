const request = require('request');

exports.fire = (pinServerPort, pin, ms, output) => new Promise((resolve, reject) => {
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
