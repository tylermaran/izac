const request = require('request');

exports.fire = (pin, ms, output) => new Promise((resolve, reject) => {
  request({
    method: "POST",
    uri: `http://localhost:5000/pins/${pin}/fire`,
    json: true,
    body: JSON.stringify({ output, sleep_ms: ms })
  }, (error, response, body) => error ? reject(error) : resolve());
});

exports.off_then_on = (pin, ms) => exports.fire(pin, ms, 0);

exports.on_then_off = (pin, ms) => exports.fire(pin, ms, 1);

exports.dispenseStraw = (pinForStrawDispenser) => {
  return Promise.resolve(); // @TODO
  // return exports.on_then_off(pinForStrawDispenser, 10000);
}
