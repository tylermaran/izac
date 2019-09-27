module.exports.up = function (next) {
  console.log('hello world');
  next();
}

module.exports.down = function (next) {
  next();
}
