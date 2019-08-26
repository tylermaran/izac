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

exports.off_then_on = (pinServerPort, pin, ms) =>
  exports.fire(pinServerPort, pin, ms, 0);

exports.on_then_off = (pinServerPort, pin, ms) =>
  exports.fire(pinServerPort, pin, ms, 1);

exports.dispenseStraw = (pinForStrawDispenser) => {
  return Promise.resolve(); // @TODO
  // return exports.on_then_off(pinForStrawDispenser, 10000);
}
